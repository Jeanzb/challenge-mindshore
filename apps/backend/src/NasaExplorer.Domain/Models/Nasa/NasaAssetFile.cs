namespace NasaExplorer.Domain.Models.Nasa;

public sealed record NasaAssetFile(
    string Url,
    string? Rel,
    string? Render,
    int? Width,
    int? Height,
    long? Size);
