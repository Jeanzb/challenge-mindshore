namespace NasaExplorer.Domain.Models.Nasa;

public sealed record NasaImageAsset(
    string NasaImageId,
    string Title,
    string? Description,
    string? Center,
    string MediaType,
    string ThumbnailUrl,
    string ImageUrl,
    string? SourceUrl,
    DateTimeOffset? DateCreated,
    IReadOnlyCollection<string> Keywords);
