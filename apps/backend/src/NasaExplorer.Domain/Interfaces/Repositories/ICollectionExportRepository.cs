using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface ICollectionExportRepository
{
    Task AddAsync(CollectionExport export, CancellationToken cancellationToken = default);
}
