using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Infrastructure.Persistence;
using NasaExplorer.Infrastructure.Persistence.Repositories;

namespace NasaExplorer.Infrastructure.Tests.Persistence.Repositories;

public sealed class CollectionRepositoryTests
{
    [Fact]
    public async Task AddImageAsync_persists_new_collection_image_on_tracked_collection()
    {
        Guid userId = Guid.NewGuid();
        await using AppDbContext context = CreateContext();
        Collection collection = Collection.Create(userId, "Mars", "Rover imagery", DateTimeOffset.UtcNow);
        SpaceImage image = CreateImage("mars-1", "Mars 1");
        await context.Collections.AddAsync(collection);
        await context.SpaceImages.AddAsync(image);
        await context.SaveChangesAsync();
        CollectionRepository repository = new(context);

        Collection trackedCollection = await repository.GetByIdForUserAsync(collection.Id, userId)
            ?? throw new InvalidOperationException("Seeded collection was not found.");
        trackedCollection.Images.Add(CollectionImage.Create(
            trackedCollection.Id,
            image.Id,
            "Reference image",
            0,
            DateTimeOffset.UtcNow));

        await repository.AddImageAsync(trackedCollection.Images.Single());

        CollectionImage? result = await context.CollectionImages
            .AsNoTracking()
            .SingleOrDefaultAsync(collectionImage => collectionImage.CollectionId == collection.Id);
        Assert.NotNull(result);
        Assert.Equal(image.Id, result.SpaceImageId);
        Assert.Equal("Reference image", result.UserNote);
    }

    [Fact]
    public async Task GetByIdForUserAsync_returns_collection_only_to_its_owner()
    {
        Guid ownerId = Guid.NewGuid();
        Guid intruderId = Guid.NewGuid();
        await using AppDbContext context = CreateContext();
        Collection collection = Collection.Create(ownerId, "Private Mars", "Owner only", DateTimeOffset.UtcNow);
        await context.Collections.AddAsync(collection);
        await context.SaveChangesAsync();
        CollectionRepository repository = new(context);

        Collection? ownerResult = await repository.GetByIdForUserAsync(collection.Id, ownerId);
        Collection? intruderResult = await repository.GetByIdForUserAsync(collection.Id, intruderId);

        Assert.NotNull(ownerResult);
        Assert.Equal(collection.Id, ownerResult.Id);
        Assert.Null(intruderResult);
    }

    [Fact]
    public async Task GetByIdForUserAsync_excludes_soft_deleted_collections_from_their_owner()
    {
        Guid ownerId = Guid.NewGuid();
        await using AppDbContext context = CreateContext();
        Collection collection = Collection.Create(ownerId, "Mars", "Rover imagery", DateTimeOffset.UtcNow);
        collection.Delete(DateTimeOffset.UtcNow);
        await context.Collections.AddAsync(collection);
        await context.SaveChangesAsync();
        CollectionRepository repository = new(context);

        Collection? result = await repository.GetByIdForUserAsync(collection.Id, ownerId);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByUserIdAsync_returns_only_the_callers_collections_most_recent_first()
    {
        Guid ownerId = Guid.NewGuid();
        Guid otherUserId = Guid.NewGuid();
        await using AppDbContext context = CreateContext();
        Collection older = Collection.Create(ownerId, "Older", null, new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero));
        Collection newer = Collection.Create(ownerId, "Newer", null, new DateTimeOffset(2024, 6, 1, 0, 0, 0, TimeSpan.Zero));
        Collection foreign = Collection.Create(otherUserId, "Foreign", null, DateTimeOffset.UtcNow);
        Collection deleted = Collection.Create(ownerId, "Deleted", null, DateTimeOffset.UtcNow);
        deleted.Delete(DateTimeOffset.UtcNow);
        await context.Collections.AddRangeAsync(older, newer, foreign, deleted);
        await context.SaveChangesAsync();
        CollectionRepository repository = new(context);

        IReadOnlyCollection<Collection> result = await repository.GetByUserIdAsync(ownerId);

        Assert.Equal(["Newer", "Older"], result.Select(collection => collection.Name).ToArray());
    }

    [Fact]
    public async Task GetImagesByIdsForUserAsync_returns_only_images_within_the_callers_collections()
    {
        Guid ownerId = Guid.NewGuid();
        Guid otherUserId = Guid.NewGuid();
        await using AppDbContext context = CreateContext();
        Collection ownerCollection = Collection.Create(ownerId, "Owner", null, DateTimeOffset.UtcNow);
        Collection foreignCollection = Collection.Create(otherUserId, "Foreign", null, DateTimeOffset.UtcNow);
        SpaceImage ownerImage = CreateImage("mars-1", "Mars 1");
        SpaceImage foreignImage = CreateImage("mars-2", "Mars 2");
        CollectionImage ownerCollectionImage = CollectionImage.Create(ownerCollection.Id, ownerImage.Id, null, 0, DateTimeOffset.UtcNow);
        CollectionImage foreignCollectionImage = CollectionImage.Create(foreignCollection.Id, foreignImage.Id, null, 0, DateTimeOffset.UtcNow);
        await context.Collections.AddRangeAsync(ownerCollection, foreignCollection);
        await context.SpaceImages.AddRangeAsync(ownerImage, foreignImage);
        await context.CollectionImages.AddRangeAsync(ownerCollectionImage, foreignCollectionImage);
        await context.SaveChangesAsync();
        CollectionRepository repository = new(context);

        IReadOnlyCollection<CollectionImage> result = await repository.GetImagesByIdsForUserAsync(
            [ownerCollectionImage.Id, foreignCollectionImage.Id],
            ownerId);

        CollectionImage single = Assert.Single(result);
        Assert.Equal(ownerCollectionImage.Id, single.Id);
    }

    private static AppDbContext CreateContext()
    {
        DbContextOptions<AppDbContext> options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static SpaceImage CreateImage(string nasaId, string title)
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
}
