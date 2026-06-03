using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class CollectionImageConfiguration : IEntityTypeConfiguration<CollectionImage>
{
    public void Configure(EntityTypeBuilder<CollectionImage> builder)
    {
        builder.ToTable("CollectionImages");

        builder.HasKey(image => image.Id);

        builder.Property(image => image.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(image => image.CollectionId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(image => image.NasaImageId)
            .HasMaxLength(DomainConstraints.CollectionImages.NasaImageIdMaxLength)
            .IsRequired();

        builder.Property(image => image.Title)
            .HasMaxLength(DomainConstraints.CollectionImages.TitleMaxLength)
            .IsRequired();

        builder.Property(image => image.Description)
            .HasMaxLength(DomainConstraints.CollectionImages.DescriptionMaxLength);

        builder.Property(image => image.ThumbnailUrl)
            .HasMaxLength(DomainConstraints.CollectionImages.UrlMaxLength)
            .IsRequired();

        builder.Property(image => image.ImageUrl)
            .HasMaxLength(DomainConstraints.CollectionImages.UrlMaxLength)
            .IsRequired();

        builder.Property(image => image.DateTaken)
            .HasColumnType("datetimeoffset");

        builder.Property(image => image.AddedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(image => new { image.CollectionId, image.NasaImageId })
            .IsUnique();

        builder.HasMany(image => image.Enrichments)
            .WithOne()
            .HasForeignKey(enrichment => enrichment.CollectionImageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(image => image.Tags)
            .WithOne()
            .HasForeignKey(tag => tag.CollectionImageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
