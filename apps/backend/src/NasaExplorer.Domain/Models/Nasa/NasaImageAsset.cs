namespace NasaExplorer.Domain.Models.Nasa;

public sealed record NasaImageAsset(
    string NasaImageId,
    string Title,
    string? Description,
    string ThumbnailUrl,
    string ImageUrl,
    DateTimeOffset? DateCreated,
    IReadOnlyCollection<string> Keywords);
