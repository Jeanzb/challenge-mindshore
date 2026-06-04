namespace NasaExplorer.Application.DTOs.Ai;

public sealed class EnrichmentResultDto
{
    public Guid SpaceImageId { get; set; }

    public string NasaImageId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public IReadOnlyCollection<string> FunFacts { get; set; } = [];

    public string HistoricalContext { get; set; } = string.Empty;

    public bool FromCache { get; set; }
}
