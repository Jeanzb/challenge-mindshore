namespace NasaExplorer.Application.DTOs.Search;

public sealed class NasaSearchResultDto
{
    public IReadOnlyCollection<NasaImageDto> Images { get; set; } = [];

    public int TotalHits { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }
}
