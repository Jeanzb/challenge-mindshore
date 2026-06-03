using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface IImageEnrichmentRepository
{
    Task<IReadOnlyCollection<ImageEnrichment>> GetByCollectionImageIdAsync(Guid collectionImageId, CancellationToken cancellationToken = default);

    Task AddAsync(ImageEnrichment enrichment, CancellationToken cancellationToken = default);
}
