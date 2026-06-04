namespace NasaExplorer.Application.DTOs.Search;

public sealed class NasaImageUrlsDto
{
    public string Thumbnail { get; set; } = string.Empty;

    public string Card { get; set; } = string.Empty;

    public string Preview { get; set; } = string.Empty;

    public string Full { get; set; } = string.Empty;

    public string? Source { get; set; }
}
