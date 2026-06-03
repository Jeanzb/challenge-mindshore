using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface IImageEnrichmentRepository
{
    Task<ImageEnrichment?> GetBySpaceImageUserAndTypeAsync(Guid spaceImageId, Guid userId, string type, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ImageEnrichment>> GetBySpaceImageIdAsync(Guid spaceImageId, CancellationToken cancellationToken = default);

    Task AddAsync(ImageEnrichment enrichment, CancellationToken cancellationToken = default);
}
