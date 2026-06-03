using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class SpaceImageConfiguration : IEntityTypeConfiguration<SpaceImage>
{
    public void Configure(EntityTypeBuilder<SpaceImage> builder)
    {
        builder.ToTable("SpaceImages");

        builder.HasKey(image => image.Id);

        builder.Property(image => image.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(image => image.NasaId)
            .HasMaxLength(DomainConstraints.SpaceImages.NasaIdMaxLength)
            .IsRequired();

        builder.HasIndex(image => image.NasaId)
            .IsUnique();

        builder.Property(image => image.Title)
            .HasMaxLength(DomainConstraints.SpaceImages.TitleMaxLength)
            .IsRequired();

        builder.Property(image => image.Description)
            .HasMaxLength(DomainConstraints.SpaceImages.DescriptionMaxLength);

        builder.Property(image => image.ImageUrl)
            .HasMaxLength(DomainConstraints.SpaceImages.UrlMaxLength)
            .IsRequired();

        builder.Property(image => image.ThumbnailUrl)
            .HasMaxLength(DomainConstraints.SpaceImages.UrlMaxLength);

        builder.Property(image => image.SourceUrl)
            .HasMaxLength(DomainConstraints.SpaceImages.UrlMaxLength);

        builder.Property(image => image.MediaType)
            .HasMaxLength(DomainConstraints.SpaceImages.MediaTypeMaxLength)
            .IsRequired();

        builder.Property(image => image.Center)
            .HasMaxLength(DomainConstraints.SpaceImages.CenterMaxLength);

        builder.Property(image => image.Mission)
            .HasMaxLength(DomainConstraints.SpaceImages.MissionMaxLength);

        builder.Property(image => image.Rover)
            .HasMaxLength(DomainConstraints.SpaceImages.RoverMaxLength);

        builder.Property(image => image.Camera)
            .HasMaxLength(DomainConstraints.SpaceImages.CameraMaxLength);

        builder.Property(image => image.DateCreated)
            .HasColumnType("datetimeoffset");

        builder.Property(image => image.Keywords)
            .HasMaxLength(DomainConstraints.SpaceImages.KeywordsMaxLength);

        builder.Property(image => image.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.Property(image => image.UpdatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(image => image.DateCreated);

        builder.HasIndex(image => image.Mission);

        builder.HasIndex(image => image.Rover);

        builder.HasIndex(image => image.Camera);

        builder.HasIndex(image => image.MediaType);
    }
}
