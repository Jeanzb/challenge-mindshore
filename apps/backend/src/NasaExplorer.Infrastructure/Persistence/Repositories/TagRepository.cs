using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class TagRepository : ITagRepository
{
    private readonly AppDbContext _context;

    public TagRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Tag?> GetByUserAndNormalizedNameAsync(
        Guid userId,
        string normalizedName,
        CancellationToken cancellationToken = default)
    {
        return await _context.Tags
            .FirstOrDefaultAsync(
                tag => tag.UserId == userId && tag.NormalizedName == normalizedName,
                cancellationToken);
    }

    public async Task<ImageTag?> GetImageTagForUserAsync(
        Guid spaceImageId,
        Guid tagId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.ImageTags
            .Include(imageTag => imageTag.Tag)
            .FirstOrDefaultAsync(
                imageTag =>
                    imageTag.SpaceImageId == spaceImageId
                    && imageTag.TagId == tagId
                    && imageTag.Tag != null
                    && imageTag.Tag.UserId == userId,
                cancellationToken);
    }

    public async Task AddTagAsync(Tag tag, CancellationToken cancellationToken = default)
    {
        await _context.Tags.AddAsync(tag, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task AddImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default)
    {
        await _context.ImageTags.AddAsync(imageTag, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default)
    {
        _context.ImageTags.Remove(imageTag);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
