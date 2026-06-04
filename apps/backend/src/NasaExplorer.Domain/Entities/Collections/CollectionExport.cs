using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Collections;

public sealed class CollectionExport
{
    private CollectionExport()
    {
        Format = string.Empty;
    }

    private CollectionExport(
        Guid collectionId,
        Guid userId,
        string format,
        string? fileName,
        string? fileUrl,
        DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        CollectionId = Guard.AgainstEmpty(collectionId, nameof(collectionId));
        UserId = Guard.AgainstEmpty(userId, nameof(userId));
        Format = Guard.AgainstNullOrWhiteSpace(format, nameof(format), DomainConstraints.CollectionExports.FormatMaxLength);
        FileName = Guard.OptionalString(fileName, nameof(fileName), DomainConstraints.CollectionExports.FileNameMaxLength);
        FileUrl = Guard.OptionalString(fileUrl, nameof(fileUrl), DomainConstraints.CollectionExports.FileUrlMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
    }

    public Guid Id { get; private set; }

    public Guid CollectionId { get; private set; }

    public Guid UserId { get; private set; }

    public string Format { get; private set; }

    public string? FileName { get; private set; }

    public string? FileUrl { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public Collection? Collection { get; private set; }

    public static CollectionExport Create(
        Guid collectionId,
        Guid userId,
        string format,
        string? fileName,
        string? fileUrl,
        DateTimeOffset createdAt)
    {
        return new CollectionExport(collectionId, userId, format, fileName, fileUrl, createdAt);
    }
}
