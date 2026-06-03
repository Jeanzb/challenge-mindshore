using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("Tags");

        builder.HasKey(tag => tag.Id);

        builder.Property(tag => tag.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(tag => tag.UserId)
            .HasColumnType("uniqueidentifier");

        builder.Property(tag => tag.Name)
            .HasMaxLength(DomainConstraints.Tags.NameMaxLength)
            .IsRequired();

        builder.Property(tag => tag.NormalizedName)
            .HasMaxLength(DomainConstraints.Tags.NormalizedNameMaxLength)
            .IsRequired();

        builder.Property(tag => tag.IsAiGenerated)
            .IsRequired();

        builder.Property(tag => tag.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.HasIndex(tag => tag.UserId);

        builder.HasIndex(tag => tag.NormalizedName);

        builder.HasIndex(tag => new { tag.UserId, tag.NormalizedName })
            .IsUnique();

        builder.HasOne<NasaExplorer.Domain.Entities.Users.User>()
            .WithMany()
            .HasForeignKey(tag => tag.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(tag => tag.ImageTags)
            .WithOne(imageTag => imageTag.Tag)
            .HasForeignKey(imageTag => imageTag.TagId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
