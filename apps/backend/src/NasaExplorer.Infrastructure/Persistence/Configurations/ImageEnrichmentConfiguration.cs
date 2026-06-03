using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class ImageEnrichmentConfiguration : IEntityTypeConfiguration<ImageEnrichment>
{
    public void Configure(EntityTypeBuilder<ImageEnrichment> builder)
    {
        builder.ToTable("AiEnrichments");

        builder.HasKey(enrichment => enrichment.Id);

        builder.Property(enrichment => enrichment.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(enrichment => enrichment.SpaceImageId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(enrichment => enrichment.UserId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(enrichment => enrichment.Type)
            .HasMaxLength(DomainConstraints.ImageEnrichments.TypeMaxLength)
            .IsRequired();

        builder.Property(enrichment => enrichment.Prompt)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(enrichment => enrichment.Content)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(enrichment => enrichment.Model)
            .HasMaxLength(DomainConstraints.ImageEnrichments.ModelMaxLength);

        builder.Property(enrichment => enrichment.Provider)
            .HasMaxLength(DomainConstraints.ImageEnrichments.ProviderMaxLength);

        builder.Property(enrichment => enrichment.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(enrichment => enrichment.SpaceImageId);

        builder.HasIndex(enrichment => enrichment.UserId);

        builder.HasIndex(enrichment => new { enrichment.SpaceImageId, enrichment.UserId, enrichment.Type })
            .IsUnique();

        builder.HasOne(enrichment => enrichment.SpaceImage)
            .WithMany(image => image.Enrichments)
            .HasForeignKey(enrichment => enrichment.SpaceImageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<NasaExplorer.Domain.Entities.Users.User>()
            .WithMany()
            .HasForeignKey(enrichment => enrichment.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
