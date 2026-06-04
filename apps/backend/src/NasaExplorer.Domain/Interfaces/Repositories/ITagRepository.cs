using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Domain.Interfaces.Repositories;

public interface ITagRepository
{
    Task<Tag?> GetByUserAndNormalizedNameAsync(Guid userId, string normalizedName, CancellationToken cancellationToken = default);

    Task<ImageTag?> GetImageTagForUserAsync(Guid spaceImageId, Guid tagId, Guid userId, CancellationToken cancellationToken = default);

    Task AddTagAsync(Tag tag, CancellationToken cancellationToken = default);

    Task AddImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default);

    Task RemoveImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default);
}
