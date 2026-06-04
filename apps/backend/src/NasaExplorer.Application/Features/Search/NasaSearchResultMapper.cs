using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Application.Features.Search;

internal static class NasaSearchResultMapper
{
    public static NasaSearchResultDto ToDto(NasaSearchResult result)
    {
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
