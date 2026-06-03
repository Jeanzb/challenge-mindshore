using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
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

        builder.Property(tag => tag.CollectionImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(tag => tag.Name)
            .HasMaxLength(DomainConstraints.ImageTags.NameMaxLength)
            .IsRequired();

        builder.Property(tag => tag.Source)
            .HasMaxLength(DomainConstraints.ImageTags.SourceMaxLength)
            .IsRequired();

        builder.HasIndex(tag => new { tag.CollectionImageId, tag.Name })
            .IsUnique();
    }
}
