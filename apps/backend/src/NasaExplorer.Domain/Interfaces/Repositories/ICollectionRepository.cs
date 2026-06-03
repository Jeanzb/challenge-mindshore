using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface ICollectionRepository
{
    Task<Collection?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Collection>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task AddAsync(Collection collection, CancellationToken cancellationToken = default);

    Task UpdateAsync(Collection collection, CancellationToken cancellationToken = default);
}
