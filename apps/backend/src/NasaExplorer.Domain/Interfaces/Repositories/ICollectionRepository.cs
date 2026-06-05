using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface ICollectionRepository
{
    Task<Collection?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Collection>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<CollectionImage>> GetImagesByIdsForUserAsync(IReadOnlyCollection<Guid> imageIds, Guid userId, CancellationToken cancellationToken = default);

    Task AddAsync(Collection collection, CancellationToken cancellationToken = default);

    Task AddImageAsync(CollectionImage image, CancellationToken cancellationToken = default);

    Task UpdateAsync(Collection collection, CancellationToken cancellationToken = default);
}
