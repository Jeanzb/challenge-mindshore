using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageTag
{
    private ImageTag()
    {
        Name = string.Empty;
        Source = string.Empty;
    }

    private ImageTag(Guid collectionImageId, string name, string source)
    {
        Id = Guid.NewGuid();
        CollectionImageId = Guard.AgainstEmpty(collectionImageId, nameof(collectionImageId));
        Name = Guard.AgainstNullOrWhiteSpace(name, nameof(name), DomainConstraints.ImageTags.NameMaxLength);
        Source = Guard.AgainstNullOrWhiteSpace(source, nameof(source), DomainConstraints.ImageTags.SourceMaxLength).ToLowerInvariant();

        if (!ImageTagSources.IsValid(Source))
        {
            throw new ArgumentException("Invalid tag source.", nameof(source));
        }
    }

    public Guid Id { get; private set; }

    public Guid CollectionImageId { get; private set; }

    public string Name { get; private set; }

    public string Source { get; private set; }

    public static ImageTag Create(Guid collectionImageId, string name, string source)
    {
        return new ImageTag(collectionImageId, name, source);
    }
}
