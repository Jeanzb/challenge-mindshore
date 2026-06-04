namespace NasaExplorer.Application.DTOs.Ai;

public sealed class ComparisonResultDto
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string Analysis { get; set; } = string.Empty;

    public IReadOnlyCollection<Guid> ImageIds { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
}
