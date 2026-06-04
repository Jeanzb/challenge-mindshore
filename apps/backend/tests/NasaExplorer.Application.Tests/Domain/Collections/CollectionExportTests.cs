using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Application.Tests.Domain.Collections;

public sealed class CollectionExportTests
{
    [Fact]
    public void Create_builds_export_history_record()
    {
        Guid collectionId = Guid.NewGuid();
        Guid userId = Guid.NewGuid();
        DateTimeOffset createdAt = DateTimeOffset.UtcNow;

        CollectionExport export = CollectionExport.Create(
            collectionId,
            userId,
            " PDF ",
            " mars.pdf ",
            " https://example.com/mars.pdf ",
            createdAt);

        Assert.Equal(collectionId, export.CollectionId);
        Assert.Equal(userId, export.UserId);
        Assert.Equal("PDF", export.Format);
        Assert.Equal("mars.pdf", export.FileName);
        Assert.Equal("https://example.com/mars.pdf", export.FileUrl);
        Assert.Equal(createdAt, export.CreatedAt);
    }

    [Fact]
    public void Create_allows_missing_file_metadata()
    {
        CollectionExport export = CollectionExport.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            "PDF",
            null,
            " ",
            DateTimeOffset.UtcNow);

        Assert.Null(export.FileName);
        Assert.Null(export.FileUrl);
    }

    [Fact]
    public void Create_rejects_empty_collection_id()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => CollectionExport.Create(
            Guid.Empty,
            Guid.NewGuid(),
            "PDF",
            null,
            null,
            DateTimeOffset.UtcNow));

        Assert.Equal("collectionId", exception.ParamName);
    }

    [Fact]
    public void Create_rejects_empty_user_id()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => CollectionExport.Create(
            Guid.NewGuid(),
            Guid.Empty,
            "PDF",
            null,
            null,
            DateTimeOffset.UtcNow));

        Assert.Equal("userId", exception.ParamName);
    }

    [Fact]
    public void Create_rejects_missing_format()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => CollectionExport.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            " ",
            null,
            null,
            DateTimeOffset.UtcNow));

        Assert.Equal("format", exception.ParamName);
    }

    [Fact]
    public void Create_rejects_default_created_at()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => CollectionExport.Create(
            Guid.NewGuid(),
            Guid.NewGuid(),
            "PDF",
            null,
            null,
            default));

        Assert.Equal("createdAt", exception.ParamName);
    }
}
