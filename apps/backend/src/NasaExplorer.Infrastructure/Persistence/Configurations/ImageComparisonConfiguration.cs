using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class ImageComparisonConfiguration : IEntityTypeConfiguration<ImageComparison>
{
    public void Configure(EntityTypeBuilder<ImageComparison> builder)
    {
        builder.ToTable("ImageComparisons");

        builder.HasKey(comparison => comparison.Id);

        builder.Property(comparison => comparison.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(comparison => comparison.UserId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(comparison => comparison.Title)
            .HasMaxLength(DomainConstraints.ImageComparisons.TitleMaxLength);

        builder.Property(comparison => comparison.Analysis)
            .HasColumnType("nvarchar(max)")
            .IsRequired();

        builder.Property(comparison => comparison.Prompt)
            .HasColumnType("nvarchar(max)");

        builder.Property(comparison => comparison.Model)
            .HasMaxLength(DomainConstraints.ImageComparisons.ModelMaxLength);

        builder.Property(comparison => comparison.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(comparison => comparison.UserId);

        builder.HasOne<NasaExplorer.Domain.Entities.Users.User>()
            .WithMany()
            .HasForeignKey(comparison => comparison.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(comparison => comparison.Items)
            .WithOne(item => item.ImageComparison)
            .HasForeignKey(item => item.ImageComparisonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
