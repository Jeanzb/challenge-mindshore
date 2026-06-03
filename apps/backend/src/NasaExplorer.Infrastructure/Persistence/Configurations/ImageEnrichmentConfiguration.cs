using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class ImageEnrichmentConfiguration : IEntityTypeConfiguration<ImageEnrichment>
{
    public void Configure(EntityTypeBuilder<ImageEnrichment> builder)
    {
        builder.ToTable("ImageEnrichments");

        builder.HasKey(enrichment => enrichment.Id);

        builder.Property(enrichment => enrichment.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(enrichment => enrichment.CollectionImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(enrichment => enrichment.Type)
            .HasMaxLength(DomainConstraints.ImageEnrichments.TypeMaxLength)
            .IsRequired();

        builder.Property(enrichment => enrichment.Content)
            .HasMaxLength(DomainConstraints.ImageEnrichments.ContentMaxLength)
            .IsRequired();

        builder.Property(enrichment => enrichment.GeneratedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(enrichment => new { enrichment.CollectionImageId, enrichment.Type });
    }
}
