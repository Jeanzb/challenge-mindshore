using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace NasaExplorer.Infrastructure.Auth;

public sealed class JwtService : IJwtService
{
    private readonly JwtOptions _options;

    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string GenerateAccessToken(User user)
    {
        if (string.IsNullOrWhiteSpace(_options.Secret))
        {
            throw new InvalidOperationException("JWT secret is not configured.");
        }

        DateTime now = DateTime.UtcNow;
        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_options.Secret));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);
        Claim[] claims =
        [
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.DisplayName)
        ];

        JwtSecurityToken token = new(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: now,
            expires: now.AddMinutes(_options.AccessTokenMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        byte[] randomBytes = RandomNumberGenerator.GetBytes(64);
        return Base64UrlEncoder.Encode(randomBytes);
    }

    public string HashRefreshToken(string refreshToken)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(refreshToken);
        byte[] hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    public bool VerifyRefreshToken(string refreshToken, string refreshTokenHash)
    {
        string computedHash = HashRefreshToken(refreshToken);
        byte[] computedHashBytes = Encoding.UTF8.GetBytes(computedHash);
        byte[] storedHashBytes = Encoding.UTF8.GetBytes(refreshTokenHash);

        return computedHashBytes.Length == storedHashBytes.Length
            && CryptographicOperations.FixedTimeEquals(computedHashBytes, storedHashBytes);
    }
}
