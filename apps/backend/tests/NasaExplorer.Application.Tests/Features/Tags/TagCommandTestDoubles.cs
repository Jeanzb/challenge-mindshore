using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Tests.Features.Tags;

internal sealed class FakeTagRepository : ITagRepository
{
    private readonly Tag? _tag;
    private readonly ImageTag? _imageTag;

    public FakeTagRepository(Tag? tag = null, ImageTag? imageTag = null)
    {
        _tag = tag;
        _imageTag = imageTag;
    }

    public Tag? AddedTag { get; private set; }

    public ImageTag? AddedImageTag { get; private set; }

    public ImageTag? RemovedImageTag { get; private set; }

    public Task<Tag?> GetByUserAndNormalizedNameAsync(
        Guid userId,
        string normalizedName,
        CancellationToken cancellationToken = default)
    {
        Tag? tag = _tag is not null
            && _tag.UserId == userId
            && _tag.NormalizedName == normalizedName
                ? _tag
                : null;

        return Task.FromResult(tag);
    }

    public Task<ImageTag?> GetImageTagForUserAsync(
        Guid spaceImageId,
        Guid tagId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        ImageTag? imageTag = _imageTag is not null
            && _imageTag.SpaceImageId == spaceImageId
            && _imageTag.TagId == tagId
            && _imageTag.Tag?.UserId == userId
                ? _imageTag
                : null;

        return Task.FromResult(imageTag);
    }

    public Task AddTagAsync(Tag tag, CancellationToken cancellationToken = default)
    {
        AddedTag = tag;

        return Task.CompletedTask;
    }

    public Task AddImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default)
    {
        AddedImageTag = imageTag;

        return Task.CompletedTask;
    }

    public Task RemoveImageTagAsync(ImageTag imageTag, CancellationToken cancellationToken = default)
    {
        RemovedImageTag = imageTag;

        return Task.CompletedTask;
    }
}
