namespace NasaExplorer.Application.DTOs.Collections;

public sealed class CollectionDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public IReadOnlyCollection<CollectionImageDto> Images { get; set; } = [];
}
