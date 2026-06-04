using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class ImageComparisonRepository : IImageComparisonRepository
{
    private readonly AppDbContext _context;

    public ImageComparisonRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ImageComparison comparison, CancellationToken cancellationToken = default)
    {
        await _context.ImageComparisons.AddAsync(comparison, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
