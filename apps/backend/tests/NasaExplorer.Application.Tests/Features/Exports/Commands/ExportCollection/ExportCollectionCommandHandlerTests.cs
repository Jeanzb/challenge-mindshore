using NasaExplorer.Application.DTOs.Exports;
using NasaExplorer.Application.Features.Exports.Commands.ExportCollection;
using NasaExplorer.Application.Tests.Features.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Exports;

namespace NasaExplorer.Application.Tests.Features.Exports.Commands.ExportCollection;

public sealed class ExportCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_generates_pdf_and_records_export_for_current_user_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        FakeCollectionExportRepository exportRepository = new();
        StubCollectionExportFileService exportFileService = new(new CollectionExportFile(
            "mars.pdf",
            "application/pdf",
            [37, 80, 68, 70]));
        ExportCollectionCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            exportRepository,
            exportFileService,
            new StubCurrentUserService(userId));

        CollectionExportResultDto result = await handler.Handle(
            new ExportCollectionCommand(collection.Id, "PDF"),
            CancellationToken.None);

        Assert.NotNull(exportRepository.AddedExport);
        Assert.Equal(collection.Id, exportRepository.AddedExport.CollectionId);
        Assert.Equal(userId, exportRepository.AddedExport.UserId);
        Assert.Equal("PDF", exportRepository.AddedExport.Format);
        Assert.Equal("mars.pdf", result.FileName);
        Assert.Equal("application/pdf", result.ContentType);
        Assert.Equal([37, 80, 68, 70], result.Content);
        Assert.Equal(collection, exportFileService.LastCollection);
    }
}

internal sealed class FakeCollectionExportRepository : ICollectionExportRepository
{
    public CollectionExport? AddedExport { get; private set; }

    public Task AddAsync(CollectionExport export, CancellationToken cancellationToken = default)
    {
        AddedExport = export;

        return Task.CompletedTask;
    }
}

internal sealed class StubCollectionExportFileService : ICollectionExportFileService
{
    private readonly CollectionExportFile _file;

    public StubCollectionExportFileService(CollectionExportFile file)
    {
        _file = file;
    }

    public Collection? LastCollection { get; private set; }

    public Task<CollectionExportFile> CreatePdfAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        LastCollection = collection;

        return Task.FromResult(_file);
    }
}
