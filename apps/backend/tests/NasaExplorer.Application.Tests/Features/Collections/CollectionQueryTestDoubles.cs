using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;
using System.Reflection;

namespace NasaExplorer.Application.Tests.Features.Collections;

internal sealed class StubCurrentUserService : ICurrentUserService
{
    public StubCurrentUserService(Guid? userId)
    {
        UserId = userId;
    }

    public bool IsAuthenticated => UserId.HasValue;

    public Guid? UserId { get; }

    public Guid GetRequiredUserId()
    {
        return UserId ?? throw new UnauthorizedException("Authenticated user id is required.");
    }
}

internal sealed class FakeCollectionRepository : ICollectionRepository
{
    private readonly IReadOnlyCollection<Collection> _collections;
    private readonly Collection? _collection;

    public FakeCollectionRepository(IReadOnlyCollection<Collection> collections)
    {
        _collections = collections;
    }

    public FakeCollectionRepository(Collection? collection)
    {
        _collections = [];
        _collection = collection;
    }

    public Guid? LastRequestedUserId { get; private set; }

    public Guid? LastRequestedCollectionId { get; private set; }

    public Collection? AddedCollection { get; private set; }

    public Collection? UpdatedCollection { get; private set; }

    public Task<Collection?> GetByIdForUserAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        LastRequestedCollectionId = id;
        LastRequestedUserId = userId;

        return Task.FromResult(_collection);
    }

    public Task<IReadOnlyCollection<Collection>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        LastRequestedUserId = userId;

        return Task.FromResult(_collections);
    }

    public Task<IReadOnlyCollection<CollectionImage>> GetImagesByIdsForUserAsync(
        IReadOnlyCollection<Guid> imageIds,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        LastRequestedUserId = userId;

        IReadOnlyCollection<CollectionImage> images = _collection is null
            ? []
            : _collection.Images
                .Where(image => imageIds.Contains(image.Id))
                .ToArray();

        return Task.FromResult(images);
    }

    public Task AddAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        AddedCollection = collection;

        return Task.CompletedTask;
    }

    public Task UpdateAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        UpdatedCollection = collection;

        return Task.CompletedTask;
    }
}

internal sealed class FakeSpaceImageRepository : ISpaceImageRepository
{
    private readonly SpaceImage? _image;

    public FakeSpaceImageRepository(SpaceImage? image)
    {
        _image = image;
    }

    public string? LastRequestedNasaId { get; private set; }

    public SpaceImage? AddedImage { get; private set; }

    public Task<SpaceImage?> GetByNasaIdAsync(string nasaId, CancellationToken cancellationToken = default)
    {
        LastRequestedNasaId = nasaId;

        return Task.FromResult(_image);
    }

    public Task AddAsync(SpaceImage image, CancellationToken cancellationToken = default)
    {
        AddedImage = image;

        return Task.CompletedTask;
    }
}

internal static class CollectionQueryTestData
{
    public static Collection CreateCollection(Guid userId, string name)
    {
        return Collection.Create(userId, name, "Description", DateTimeOffset.UtcNow);
    }

    public static CollectionImage CreateCollectionImage(Collection collection, SpaceImage spaceImage, int sortOrder)
    {
        CollectionImage collectionImage = CollectionImage.Create(collection.Id, spaceImage.Id, $"Note {sortOrder}", sortOrder, DateTimeOffset.UtcNow);
        typeof(CollectionImage)
            .GetProperty(nameof(CollectionImage.SpaceImage), BindingFlags.Instance | BindingFlags.Public)!
            .SetValue(collectionImage, spaceImage);

        collection.Images.Add(collectionImage);

        return collectionImage;
    }

    public static SpaceImage CreateSpaceImage(string nasaId, string title)
    {
        return SpaceImage.Create(
            nasaId,
            title,
            "NASA description",
            $"https://images.test/{nasaId}.jpg",
            $"https://images.test/{nasaId}-thumb.jpg",
            $"https://images.nasa.gov/details/{nasaId}",
            "image",
            "JPL",
            "Mars",
            "Perseverance",
            "Mastcam",
            DateTimeOffset.UtcNow,
            "mars",
            DateTimeOffset.UtcNow);
    }

    public static void AddTag(SpaceImage spaceImage, Guid userId, string name, bool isAiGenerated)
    {
        Tag tag = Tag.Create(userId, name, isAiGenerated, DateTimeOffset.UtcNow);
        ImageTag imageTag = ImageTag.Create(spaceImage.Id, tag.Id, DateTimeOffset.UtcNow);
        typeof(ImageTag)
            .GetProperty(nameof(ImageTag.Tag), BindingFlags.Instance | BindingFlags.Public)!
            .SetValue(imageTag, tag);

        spaceImage.ImageTags.Add(imageTag);
    }
}
