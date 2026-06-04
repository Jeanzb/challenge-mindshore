using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Infrastructure.Persistence;
using NasaExplorer.Infrastructure.Persistence.Repositories;

namespace NasaExplorer.Infrastructure.Tests.Persistence.Repositories;

public sealed class SpaceImageRepositoryTests
{
    [Fact]
    public async Task GetByNasaIdAsync_returns_matching_space_image()
    {
        await using AppDbContext context = CreateContext();
        SpaceImage image = CreateImage("mars-1", "Mars 1");
        await context.SpaceImages.AddAsync(image);
        await context.SaveChangesAsync();
        SpaceImageRepository repository = new(context);

        SpaceImage? result = await repository.GetByNasaIdAsync("mars-1");

        Assert.NotNull(result);
        Assert.Equal(image.Id, result.Id);
        Assert.Equal("Mars 1", result.Title);
    }

    [Fact]
    public async Task GetByNasaIdAsync_returns_null_when_image_is_missing()
    {
        await using AppDbContext context = CreateContext();
        SpaceImageRepository repository = new(context);

        SpaceImage? result = await repository.GetByNasaIdAsync("missing");

        Assert.Null(result);
    }

    [Fact]
    public async Task AddAsync_persists_space_image()
    {
        await using AppDbContext context = CreateContext();
        SpaceImageRepository repository = new(context);
        SpaceImage image = CreateImage("apollo-1", "Apollo 1");

        await repository.AddAsync(image);

        SpaceImage? result = await context.SpaceImages.SingleOrDefaultAsync(spaceImage => spaceImage.NasaId == "apollo-1");
        Assert.NotNull(result);
        Assert.Equal("Apollo 1", result.Title);
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
