using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.Id)
            .HasColumnType("uniqueidentifier")
            .HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(user => user.Email)
            .HasMaxLength(DomainConstraints.Users.EmailMaxLength)
            .IsRequired();

        builder.HasIndex(user => user.Email)
            .IsUnique();

        builder.Property(user => user.PasswordHash)
            .HasMaxLength(DomainConstraints.Users.PasswordHashMaxLength)
            .IsRequired();

        builder.Property(user => user.DisplayName)
            .HasMaxLength(DomainConstraints.Users.DisplayNameMaxLength)
            .IsRequired();

        builder.Property(user => user.CreatedAt)
            .HasColumnType("datetimeoffset")
            .IsRequired();

        builder.Property(user => user.RefreshToken)
            .HasMaxLength(DomainConstraints.Users.RefreshTokenMaxLength);

        builder.Property(user => user.RefreshTokenExpiresAt)
            .HasColumnType("datetimeoffset");

        builder.HasMany(user => user.Collections)
            .WithOne()
            .HasForeignKey(collection => collection.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
