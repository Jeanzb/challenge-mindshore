namespace NasaExplorer.Application.DTOs.Collections;

public sealed class CollectionSummaryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int ImageCount { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
