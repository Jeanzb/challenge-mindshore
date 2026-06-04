using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class SpaceImage
{
    private SpaceImage()
    {
        NasaId = string.Empty;
        Title = string.Empty;
        ImageUrl = string.Empty;
        MediaType = string.Empty;
        Enrichments = [];
        ImageTags = [];
        ComparisonItems = [];
    }

    private SpaceImage(
        string nasaId,
        string title,
        string? description,
        string imageUrl,
        string? thumbnailUrl,
        string? sourceUrl,
        string mediaType,
        string? center,
        string? mission,
        string? rover,
        string? camera,
        DateTimeOffset? dateCreated,
        string? keywords,
        DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        NasaId = Guard.AgainstNullOrWhiteSpace(nasaId, nameof(nasaId), DomainConstraints.SpaceImages.NasaIdMaxLength);
        Title = Guard.AgainstNullOrWhiteSpace(title, nameof(title), DomainConstraints.SpaceImages.TitleMaxLength);
        Description = Guard.OptionalString(description, nameof(description), DomainConstraints.SpaceImages.DescriptionMaxLength);
        ImageUrl = Guard.AgainstNullOrWhiteSpace(imageUrl, nameof(imageUrl), DomainConstraints.SpaceImages.UrlMaxLength);
        ThumbnailUrl = Guard.OptionalString(thumbnailUrl, nameof(thumbnailUrl), DomainConstraints.SpaceImages.UrlMaxLength);
        SourceUrl = Guard.OptionalString(sourceUrl, nameof(sourceUrl), DomainConstraints.SpaceImages.UrlMaxLength);
        MediaType = Guard.AgainstNullOrWhiteSpace(mediaType, nameof(mediaType), DomainConstraints.SpaceImages.MediaTypeMaxLength);
        Center = Guard.OptionalString(center, nameof(center), DomainConstraints.SpaceImages.CenterMaxLength);
        Mission = Guard.OptionalString(mission, nameof(mission), DomainConstraints.SpaceImages.MissionMaxLength);
        Rover = Guard.OptionalString(rover, nameof(rover), DomainConstraints.SpaceImages.RoverMaxLength);
        Camera = Guard.OptionalString(camera, nameof(camera), DomainConstraints.SpaceImages.CameraMaxLength);
        DateCreated = dateCreated;
        Keywords = Guard.OptionalString(keywords, nameof(keywords), DomainConstraints.SpaceImages.KeywordsMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
        UpdatedAt = CreatedAt;
        Enrichments = [];
        ImageTags = [];
        ComparisonItems = [];
    }

    public Guid Id { get; private set; }

    public string NasaId { get; private set; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public string ImageUrl { get; private set; }

    public string? ThumbnailUrl { get; private set; }

    public string? SourceUrl { get; private set; }

    public string MediaType { get; private set; }

    public string? Center { get; private set; }

    public string? Mission { get; private set; }

    public string? Rover { get; private set; }

    public string? Camera { get; private set; }

    public DateTimeOffset? DateCreated { get; private set; }

    public string? Keywords { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public ICollection<ImageEnrichment> Enrichments { get; private set; }

    public ICollection<ImageTag> ImageTags { get; private set; }

    public ICollection<ImageComparisonItem> ComparisonItems { get; private set; }

    public static SpaceImage Create(
        string nasaId,
        string title,
        string? description,
        string imageUrl,
        string? thumbnailUrl,
        string? sourceUrl,
        string mediaType,
        string? center,
        string? mission,
        string? rover,
        string? camera,
        DateTimeOffset? dateCreated,
        string? keywords,
        DateTimeOffset createdAt)
    {
        return new SpaceImage(
            nasaId,
            title,
            description,
            imageUrl,
            thumbnailUrl,
            sourceUrl,
            mediaType,
            center,
            mission,
            rover,
            camera,
            dateCreated,
            keywords,
            createdAt);
    }
}
