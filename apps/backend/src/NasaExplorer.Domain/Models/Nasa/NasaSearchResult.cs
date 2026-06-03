namespace NasaExplorer.Domain.Models.Nasa;

public sealed record NasaSearchResult(
    IReadOnlyCollection<NasaImageAsset> Images,
    int TotalHits,
    int Page,
    int PageSize);
