using NasaExplorer.Domain.Common;
namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageTag
{
    private ImageTag()
    {
    }

    private ImageTag(Guid spaceImageId, Guid tagId, DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        SpaceImageId = Guard.AgainstEmpty(spaceImageId, nameof(spaceImageId));
        TagId = Guard.AgainstEmpty(tagId, nameof(tagId));
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
    }

    public Guid Id { get; private set; }

    public Guid SpaceImageId { get; private set; }

    public Guid TagId { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public SpaceImage? SpaceImage { get; private set; }

    public Tag? Tag { get; private set; }

    public static ImageTag Create(Guid spaceImageId, Guid tagId, DateTimeOffset createdAt)
    {
        return new ImageTag(spaceImageId, tagId, createdAt);
    }
}
