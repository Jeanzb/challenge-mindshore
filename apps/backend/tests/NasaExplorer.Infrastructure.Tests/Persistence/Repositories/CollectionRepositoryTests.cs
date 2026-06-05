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
