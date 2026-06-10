using MediatR;
using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Application.Features.Search;
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
                (request.Query ?? string.Empty).Trim(),
                request.DateFrom,
                request.DateTo,
                request.Rover,
                request.Camera,
                request.Mission,
                request.Page,
                request.PageSize),
            cancellationToken);

        return NasaSearchResultMapper.ToDto(result);
    }
}
