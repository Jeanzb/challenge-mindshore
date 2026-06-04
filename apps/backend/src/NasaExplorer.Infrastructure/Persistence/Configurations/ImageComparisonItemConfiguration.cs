using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class ImageComparisonItemConfiguration : IEntityTypeConfiguration<ImageComparisonItem>
{
    public void Configure(EntityTypeBuilder<ImageComparisonItem> builder)
    {
        builder.ToTable("ImageComparisonItems");

        builder.HasKey(item => item.Id);

        builder.Property(item => item.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(item => item.ImageComparisonId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(item => item.SpaceImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(item => item.SortOrder)
            .IsRequired();

        builder.HasIndex(item => item.ImageComparisonId);

        builder.HasIndex(item => item.SpaceImageId);

        builder.HasIndex(item => new { item.ImageComparisonId, item.SpaceImageId })
            .IsUnique()
            .HasDatabaseName("UX_ImageComparisonItems_ImageComparisonId_SpaceImageId");

        builder.HasOne(item => item.SpaceImage)
            .WithMany(image => image.ComparisonItems)
            .HasForeignKey(item => item.SpaceImageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
