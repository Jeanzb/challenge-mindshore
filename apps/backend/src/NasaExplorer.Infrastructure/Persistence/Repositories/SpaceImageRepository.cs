using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class SpaceImageRepository : ISpaceImageRepository
{
    private readonly AppDbContext _context;

    public SpaceImageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SpaceImage?> GetByNasaIdAsync(string nasaId, CancellationToken cancellationToken = default)
    {
        return await _context.SpaceImages
            .AsNoTracking()
            .FirstOrDefaultAsync(image => image.NasaId == nasaId, cancellationToken);
    }

    public async Task AddAsync(SpaceImage image, CancellationToken cancellationToken = default)
    {
        await _context.SpaceImages.AddAsync(image, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
