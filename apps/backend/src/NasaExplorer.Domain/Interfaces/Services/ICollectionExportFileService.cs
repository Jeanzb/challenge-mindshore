using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Models.Exports;

namespace NasaExplorer.Domain.Interfaces.Services;

public interface ICollectionExportFileService
{
    Task<CollectionExportFile> CreatePdfAsync(Collection collection, CancellationToken cancellationToken = default);
}
