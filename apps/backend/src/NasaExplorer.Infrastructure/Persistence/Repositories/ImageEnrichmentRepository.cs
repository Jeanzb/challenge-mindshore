using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class ImageEnrichmentRepository : IImageEnrichmentRepository
{
    private readonly AppDbContext _context;

    public ImageEnrichmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<ImageEnrichment>> GetByCollectionImageIdAsync(Guid collectionImageId, CancellationToken cancellationToken = default)
    {
        return await _context.ImageEnrichments
            .AsNoTracking()
            .Where(enrichment => enrichment.CollectionImageId == collectionImageId)
            .OrderByDescending(enrichment => enrichment.GeneratedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ImageEnrichment enrichment, CancellationToken cancellationToken = default)
    {
        await _context.ImageEnrichments.AddAsync(enrichment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
