namespace NasaExplorer.Application.DTOs.Collections;

public sealed class CollectionImageDto
{
    public Guid Id { get; set; }

    public Guid SpaceImageId { get; set; }

    public string NasaImageId { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string? ThumbnailUrl { get; set; }

    public string? UserNote { get; set; }

    public int SortOrder { get; set; }

    public DateTimeOffset? DateCreated { get; set; }

    public IReadOnlyCollection<ImageTagDto> Tags { get; set; } = [];
}
