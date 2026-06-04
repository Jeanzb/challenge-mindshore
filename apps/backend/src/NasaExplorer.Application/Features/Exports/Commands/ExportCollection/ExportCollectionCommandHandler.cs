using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Exports;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Exports;

namespace NasaExplorer.Application.Features.Exports.Commands.ExportCollection;

public sealed class ExportCollectionCommandHandler : IRequestHandler<ExportCollectionCommand, CollectionExportResultDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICollectionExportRepository _collectionExportRepository;
    private readonly ICollectionExportFileService _collectionExportFileService;
    private readonly ICurrentUserService _currentUserService;

    public ExportCollectionCommandHandler(
        ICollectionRepository collectionRepository,
        ICollectionExportRepository collectionExportRepository,
        ICollectionExportFileService collectionExportFileService,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _collectionExportRepository = collectionExportRepository;
        _collectionExportFileService = collectionExportFileService;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionExportResultDto> Handle(ExportCollectionCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.CollectionId, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");
        CollectionExportFile file = await _collectionExportFileService.CreatePdfAsync(collection, cancellationToken);
        DateTimeOffset now = DateTimeOffset.UtcNow;
        CollectionExport export = CollectionExport.Create(collection.Id, userId, "PDF", file.FileName, null, now);

        await _collectionExportRepository.AddAsync(export, cancellationToken);

        return new CollectionExportResultDto
        {
            Id = export.Id,
            FileName = file.FileName,
            ContentType = file.ContentType,
            Content = file.Content,
            CreatedAt = export.CreatedAt
        };
    }
}
