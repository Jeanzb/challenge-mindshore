using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Domain.Interfaces.Services;

public interface IJwtService
{
    string GenerateAccessToken(User user);

    string GenerateRefreshToken();

    string HashRefreshToken(string refreshToken);

    bool VerifyRefreshToken(string refreshToken, string refreshTokenHash);
}
