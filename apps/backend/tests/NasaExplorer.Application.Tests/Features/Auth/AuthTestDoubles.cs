using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Tests.Features.Auth;

public sealed class FakeUserRepository : IUserRepository
{
    private readonly User? _user;

    public FakeUserRepository(User? user)
    {
        _user = user;
    }

    public User? UpdatedUser { get; private set; }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(_user is not null && _user.Id == id ? _user : null);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        Task.FromResult(
            _user is not null && string.Equals(_user.Email, email.Trim().ToLowerInvariant(), StringComparison.Ordinal)
                ? _user
                : null);

    public Task<User?> GetByRefreshTokenAsync(string refreshTokenHash, CancellationToken cancellationToken = default) =>
        Task.FromResult(_user is not null && _user.RefreshToken == refreshTokenHash ? _user : null);

    public Task<User?> GetByPasswordResetTokenAsync(string passwordResetTokenHash, CancellationToken cancellationToken = default) =>
        Task.FromResult(_user is not null && _user.PasswordResetTokenHash == passwordResetTokenHash ? _user : null);

    public Task AddAsync(User user, CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        UpdatedUser = user;
        return Task.CompletedTask;
    }
}

public sealed class StubJwtService : IJwtService
{
    private readonly string _generatedToken;

    public StubJwtService(string generatedToken = "generated-secret")
    {
        _generatedToken = generatedToken;
    }

    public string GenerateAccessToken(User user) => "access-token";

    public string GenerateRefreshToken() => _generatedToken;

    public string HashRefreshToken(string refreshToken) => $"hash:{refreshToken}";

    public bool VerifyRefreshToken(string refreshToken, string refreshTokenHash) =>
        HashRefreshToken(refreshToken) == refreshTokenHash;
}

public sealed class StubPasswordHashService : IPasswordHashService
{
    public string HashPassword(string password) => $"hashed:{password}";

    public bool VerifyPassword(string password, string passwordHash) => passwordHash == HashPassword(password);
}

public static class AuthTestData
{
    public static User CreateUser(string email = "user@cosmara.dev") =>
        User.Create(email, "hashed:Original1", "Test User", DateTimeOffset.UtcNow);
}
