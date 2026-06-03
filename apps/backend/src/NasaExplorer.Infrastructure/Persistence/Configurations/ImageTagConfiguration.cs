using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class ImageTagConfiguration : IEntityTypeConfiguration<ImageTag>
{
    public void Configure(EntityTypeBuilder<ImageTag> builder)
    {
        builder.ToTable("ImageTags");

        builder.HasKey(tag => tag.Id);

        builder.Property(tag => tag.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(tag => tag.SpaceImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(tag => tag.TagId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(tag => tag.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(tag => tag.SpaceImageId);

        builder.HasIndex(tag => tag.TagId);

        builder.HasIndex(tag => new { tag.SpaceImageId, tag.TagId })
            .IsUnique();

        builder.HasOne(tag => tag.SpaceImage)
            .WithMany(image => image.ImageTags)
            .HasForeignKey(tag => tag.SpaceImageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
