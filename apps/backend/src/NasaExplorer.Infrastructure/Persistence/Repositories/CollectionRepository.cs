using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class CollectionRepository : ICollectionRepository
{
    private readonly AppDbContext _context;

    public CollectionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Collection?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Collections
            .Include(collection => collection.Images)
            .ThenInclude(image => image.SpaceImage)
            .ThenInclude(image => image!.ImageTags
                .Where(imageTag => imageTag.Tag != null
                    && (imageTag.Tag.UserId == userId || imageTag.Tag.UserId == null)))
            .ThenInclude(imageTag => imageTag.Tag)
            .FirstOrDefaultAsync(collection => collection.Id == id && collection.UserId == userId, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Collection>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Collections
            .AsNoTracking()
            .Include(collection => collection.Images)
            .ThenInclude(image => image.SpaceImage)
            .Where(collection => collection.UserId == userId)
            .OrderByDescending(collection => collection.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<CollectionImage>> GetImagesByIdsForUserAsync(
        IReadOnlyCollection<Guid> imageIds,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.CollectionImages
            .AsNoTracking()
            .Include(image => image.SpaceImage)
            .Where(image => imageIds.Contains(image.Id)
                && _context.Collections.Any(collection => collection.Id == image.CollectionId && collection.UserId == userId))
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        await _context.Collections.AddAsync(collection, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        _context.Collections.Update(collection);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
