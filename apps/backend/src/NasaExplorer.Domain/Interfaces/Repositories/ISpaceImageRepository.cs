using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface ISpaceImageRepository
{
    Task<SpaceImage?> GetByNasaIdAsync(string nasaId, CancellationToken cancellationToken = default);

    Task AddAsync(SpaceImage image, CancellationToken cancellationToken = default);
}
