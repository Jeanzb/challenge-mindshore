using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageEnrichment
{
    private ImageEnrichment()
    {
        Type = string.Empty;
        Content = string.Empty;
    }

    private ImageEnrichment(Guid collectionImageId, string type, string content, DateTimeOffset generatedAt)
    {
        Id = Guid.NewGuid();
        CollectionImageId = Guard.AgainstEmpty(collectionImageId, nameof(collectionImageId));
        Type = Guard.AgainstNullOrWhiteSpace(type, nameof(type), DomainConstraints.ImageEnrichments.TypeMaxLength);
        Content = Guard.AgainstNullOrWhiteSpace(content, nameof(content), DomainConstraints.ImageEnrichments.ContentMaxLength);
        GeneratedAt = Guard.AgainstDefault(generatedAt, nameof(generatedAt));
    }

    public Guid Id { get; private set; }

    public Guid CollectionImageId { get; private set; }

    public string Type { get; private set; }

    public string Content { get; private set; }

    public DateTimeOffset GeneratedAt { get; private set; }

    public static ImageEnrichment Create(Guid collectionImageId, string type, string content, DateTimeOffset generatedAt)
    {
        return new ImageEnrichment(collectionImageId, type, content, generatedAt);
    }
}
