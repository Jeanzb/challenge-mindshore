using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Entities.Collections;

public sealed class CollectionImage
{
    private CollectionImage()
    {
    }

    private CollectionImage(
        Guid collectionId,
        Guid spaceImageId,
        string? userNote,
        int sortOrder,
        DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        CollectionId = Guard.AgainstEmpty(collectionId, nameof(collectionId));
        SpaceImageId = Guard.AgainstEmpty(spaceImageId, nameof(spaceImageId));
        UserNote = Guard.OptionalString(userNote, nameof(userNote), DomainConstraints.CollectionImages.UserNoteMaxLength);
        if (sortOrder < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sortOrder), "Sort order cannot be negative.");
        }

        SortOrder = sortOrder;
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
    }

    public Guid Id { get; private set; }

    public Guid CollectionId { get; private set; }

    public Guid SpaceImageId { get; private set; }

    public string? UserNote { get; private set; }

    public int SortOrder { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public SpaceImage? SpaceImage { get; private set; }

    public static CollectionImage Create(
        Guid collectionId,
        Guid spaceImageId,
        string? userNote,
        int sortOrder,
        DateTimeOffset createdAt)
    {
        return new CollectionImage(collectionId, spaceImageId, userNote, sortOrder, createdAt);
    }
}
