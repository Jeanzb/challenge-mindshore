using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface IImageEnrichmentRepository
{
    Task<ImageEnrichment?> GetBySpaceImageUserAndTypeAsync(Guid spaceImageId, Guid userId, string type, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ImageEnrichment>> GetBySpaceImageIdForUserAsync(Guid spaceImageId, Guid userId, CancellationToken cancellationToken = default);

    Task AddAsync(ImageEnrichment enrichment, CancellationToken cancellationToken = default);
}
