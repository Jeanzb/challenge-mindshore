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

    public async Task<ImageEnrichment?> GetBySpaceImageUserAndTypeAsync(
        Guid spaceImageId,
        Guid userId,
        string type,
        CancellationToken cancellationToken = default)
    {
        return await _context.AiEnrichments
            .AsNoTracking()
            .Where(enrichment =>
                enrichment.SpaceImageId == spaceImageId
                && enrichment.UserId == userId
                && enrichment.Type == type)
            .OrderByDescending(enrichment => enrichment.CreatedAt)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<ImageEnrichment>> GetBySpaceImageIdAsync(Guid spaceImageId, CancellationToken cancellationToken = default)
    {
        return await _context.AiEnrichments
            .AsNoTracking()
            .Where(enrichment => enrichment.SpaceImageId == spaceImageId)
            .OrderByDescending(enrichment => enrichment.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ImageEnrichment enrichment, CancellationToken cancellationToken = default)
    {
        await _context.AiEnrichments.AddAsync(enrichment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
