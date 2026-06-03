using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Entities.Collections;

public sealed class CollectionImage
{
    private CollectionImage()
    {
        NasaImageId = string.Empty;
        Title = string.Empty;
        ThumbnailUrl = string.Empty;
        ImageUrl = string.Empty;
        Enrichments = [];
        Tags = [];
    }

    private CollectionImage(
        Guid collectionId,
        string nasaImageId,
        string title,
        string? description,
        string thumbnailUrl,
        string imageUrl,
        DateTimeOffset? dateTaken,
        DateTimeOffset addedAt)
    {
        Id = Guid.NewGuid();
        CollectionId = Guard.AgainstEmpty(collectionId, nameof(collectionId));
        NasaImageId = Guard.AgainstNullOrWhiteSpace(nasaImageId, nameof(nasaImageId), DomainConstraints.CollectionImages.NasaImageIdMaxLength);
        Title = Guard.AgainstNullOrWhiteSpace(title, nameof(title), DomainConstraints.CollectionImages.TitleMaxLength);
        Description = Guard.OptionalString(description, nameof(description), DomainConstraints.CollectionImages.DescriptionMaxLength);
        ThumbnailUrl = Guard.AgainstNullOrWhiteSpace(thumbnailUrl, nameof(thumbnailUrl), DomainConstraints.CollectionImages.UrlMaxLength);
        ImageUrl = Guard.AgainstNullOrWhiteSpace(imageUrl, nameof(imageUrl), DomainConstraints.CollectionImages.UrlMaxLength);
        DateTaken = dateTaken;
        AddedAt = Guard.AgainstDefault(addedAt, nameof(addedAt));
        Enrichments = [];
        Tags = [];
    }

    public Guid Id { get; private set; }

    public Guid CollectionId { get; private set; }

    public string NasaImageId { get; private set; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public string ThumbnailUrl { get; private set; }

    public string ImageUrl { get; private set; }

    public DateTimeOffset? DateTaken { get; private set; }

    public DateTimeOffset AddedAt { get; private set; }

    public ICollection<ImageEnrichment> Enrichments { get; private set; }

    public ICollection<ImageTag> Tags { get; private set; }

    public static CollectionImage Create(
        Guid collectionId,
        string nasaImageId,
        string title,
        string? description,
        string thumbnailUrl,
        string imageUrl,
        DateTimeOffset? dateTaken,
        DateTimeOffset addedAt)
    {
        return new CollectionImage(collectionId, nasaImageId, title, description, thumbnailUrl, imageUrl, dateTaken, addedAt);
    }
}
