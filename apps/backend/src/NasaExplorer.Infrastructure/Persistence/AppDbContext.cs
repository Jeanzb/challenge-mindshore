using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Infrastructure.Persistence;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Collection> Collections => Set<Collection>();

    public DbSet<CollectionImage> CollectionImages => Set<CollectionImage>();

    public DbSet<SpaceImage> SpaceImages => Set<SpaceImage>();

    public DbSet<ImageEnrichment> AiEnrichments => Set<ImageEnrichment>();

    public DbSet<Tag> Tags => Set<Tag>();

    public DbSet<ImageTag> ImageTags => Set<ImageTag>();

    public DbSet<ImageComparison> ImageComparisons => Set<ImageComparison>();

    public DbSet<ImageComparisonItem> ImageComparisonItems => Set<ImageComparisonItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
