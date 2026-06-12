using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Domain.Entities.Users;

public sealed class User
{
    private User()
    {
        Email = string.Empty;
        PasswordHash = string.Empty;
        DisplayName = string.Empty;
        Collections = [];
    }

    private User(string email, string passwordHash, string displayName, DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        Email = Guard.AgainstNullOrWhiteSpace(email, nameof(email), DomainConstraints.Users.EmailMaxLength).ToLowerInvariant();
        PasswordHash = Guard.AgainstNullOrWhiteSpace(passwordHash, nameof(passwordHash), DomainConstraints.Users.PasswordHashMaxLength);
        DisplayName = Guard.AgainstNullOrWhiteSpace(displayName, nameof(displayName), DomainConstraints.Users.DisplayNameMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
        Collections = [];
    }

    public Guid Id { get; private set; }

    public string Email { get; private set; }

    public string PasswordHash { get; private set; }

    public string DisplayName { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public string? RefreshToken { get; private set; }

    public DateTimeOffset? RefreshTokenExpiresAt { get; private set; }

    public string? PasswordResetTokenHash { get; private set; }

    public DateTimeOffset? PasswordResetTokenExpiresAt { get; private set; }

    public ICollection<Collection> Collections { get; private set; }

    public static User Create(string email, string passwordHash, string displayName, DateTimeOffset createdAt)
    {
        return new User(email, passwordHash, displayName, createdAt);
    }

    public void SetRefreshToken(string refreshToken, DateTimeOffset expiresAt)
    {
        RefreshToken = Guard.AgainstNullOrWhiteSpace(refreshToken, nameof(refreshToken), DomainConstraints.Users.RefreshTokenMaxLength);
        RefreshTokenExpiresAt = Guard.AgainstDefault(expiresAt, nameof(expiresAt));
    }

    public void ClearRefreshToken()
    {
        RefreshToken = null;
        RefreshTokenExpiresAt = null;
    }

    public void SetPasswordResetToken(string passwordResetTokenHash, DateTimeOffset expiresAt)
    {
        PasswordResetTokenHash = Guard.AgainstNullOrWhiteSpace(
            passwordResetTokenHash,
            nameof(passwordResetTokenHash),
            DomainConstraints.Users.PasswordResetTokenMaxLength);
        PasswordResetTokenExpiresAt = Guard.AgainstDefault(expiresAt, nameof(expiresAt));
    }

    public void ClearPasswordResetToken()
    {
        PasswordResetTokenHash = null;
        PasswordResetTokenExpiresAt = null;
    }

    public void ResetPassword(string passwordHash)
    {
        PasswordHash = Guard.AgainstNullOrWhiteSpace(
            passwordHash,
            nameof(passwordHash),
            DomainConstraints.Users.PasswordHashMaxLength);
        ClearPasswordResetToken();
        ClearRefreshToken();
    }
}
