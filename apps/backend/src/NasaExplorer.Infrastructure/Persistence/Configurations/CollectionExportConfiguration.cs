using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class CollectionExportConfiguration : IEntityTypeConfiguration<CollectionExport>
{
    public void Configure(EntityTypeBuilder<CollectionExport> builder)
    {
        builder.ToTable("CollectionExports");

        builder.HasKey(export => export.Id);

        builder.Property(export => export.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(export => export.CollectionId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(export => export.UserId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(export => export.Format)
            .HasMaxLength(DomainConstraints.CollectionExports.FormatMaxLength)
            .IsRequired();

        builder.Property(export => export.FileName)
            .HasMaxLength(DomainConstraints.CollectionExports.FileNameMaxLength);

        builder.Property(export => export.FileUrl)
            .HasMaxLength(DomainConstraints.CollectionExports.FileUrlMaxLength);

        builder.Property(export => export.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(export => export.CollectionId);

        builder.HasIndex(export => export.UserId);

        builder.HasOne<NasaExplorer.Domain.Entities.Users.User>()
            .WithMany()
            .HasForeignKey(export => export.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
