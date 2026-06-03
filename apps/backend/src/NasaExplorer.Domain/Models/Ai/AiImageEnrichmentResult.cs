namespace NasaExplorer.Domain.Models.Ai;

public sealed record AiImageEnrichmentResult(
    string Description,
    IReadOnlyCollection<string> FunFacts,
    string HistoricalContext);
