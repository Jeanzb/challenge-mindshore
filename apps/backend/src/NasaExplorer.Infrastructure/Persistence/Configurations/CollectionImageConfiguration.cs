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

        builder.Property(image => image.SpaceImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(image => image.UserNote)
            .HasMaxLength(DomainConstraints.CollectionImages.UserNoteMaxLength);

        builder.Property(image => image.SortOrder)
            .IsRequired();

        builder.Property(image => image.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(image => image.CollectionId);

        builder.HasIndex(image => image.SpaceImageId);

        builder.HasIndex(image => new { image.CollectionId, image.SpaceImageId })
            .IsUnique();

        builder.HasOne(image => image.SpaceImage)
            .WithMany()
            .HasForeignKey(image => image.SpaceImageId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
