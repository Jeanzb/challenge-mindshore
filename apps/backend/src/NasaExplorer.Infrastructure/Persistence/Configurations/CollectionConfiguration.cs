using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class CollectionConfiguration : IEntityTypeConfiguration<Collection>
{
    public void Configure(EntityTypeBuilder<Collection> builder)
    {
        builder.ToTable("Collections");

        builder.HasKey(collection => collection.Id);

        builder.Property(collection => collection.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(collection => collection.UserId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(collection => collection.Name)
            .HasMaxLength(DomainConstraints.Collections.NameMaxLength)
            .IsRequired();

        builder.Property(collection => collection.Description)
            .HasMaxLength(DomainConstraints.Collections.DescriptionMaxLength);

        builder.Property(collection => collection.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.Property(collection => collection.UpdatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.Property(collection => collection.IsDeleted)
            .IsRequired();

        builder.Property(collection => collection.DeletedAt)
            .HasColumnType("datetimeoffset");

        builder.HasQueryFilter(collection => !collection.IsDeleted);

        builder.HasIndex(collection => new { collection.UserId, collection.Name });

        builder.HasMany(collection => collection.Images)
            .WithOne()
            .HasForeignKey(image => image.CollectionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(collection => collection.Exports)
            .WithOne(export => export.Collection)
            .HasForeignKey(export => export.CollectionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
