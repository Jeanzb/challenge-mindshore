using MediatR;
using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Application.Features.Search.Queries.SearchNasaImages;

public sealed class SearchNasaImagesQueryHandler : IRequestHandler<SearchNasaImagesQuery, NasaSearchResultDto>
{
    private readonly INasaApiService _nasaApiService;

    public SearchNasaImagesQueryHandler(INasaApiService nasaApiService)
    {
        _nasaApiService = nasaApiService;
    }

    public async Task<NasaSearchResultDto> Handle(SearchNasaImagesQuery request, CancellationToken cancellationToken)
    {
        NasaSearchResult result = await _nasaApiService.SearchImagesAsync(
            new NasaSearchCriteria(
                request.Query.Trim(),
                request.DateFrom,
                request.DateTo,
                request.Rover,
                request.Camera,
                request.Mission,
                request.Page,
                request.PageSize),
            cancellationToken);

        return new NasaSearchResultDto
        {
            TotalHits = result.TotalHits,
            Page = result.Page,
            PageSize = result.PageSize,
            Images = result.Images.Select(image => new NasaImageDto
            {
                NasaImageId = image.NasaImageId,
                Title = image.Title,
                Description = image.Description,
                Center = image.Center,
                MediaType = image.MediaType,
                ThumbnailUrl = image.ThumbnailUrl,
                ImageUrl = image.ImageUrl,
                SourceUrl = image.SourceUrl,
                DateCreated = image.DateCreated,
                Keywords = image.Keywords
            }).ToArray()
        };
    }
}
