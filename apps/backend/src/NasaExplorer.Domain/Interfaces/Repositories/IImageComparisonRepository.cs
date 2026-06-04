using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface IImageComparisonRepository
{
    Task AddAsync(ImageComparison comparison, CancellationToken cancellationToken = default);
}
