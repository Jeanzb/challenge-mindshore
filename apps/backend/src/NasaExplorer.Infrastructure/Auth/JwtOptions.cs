using Microsoft.Extensions.Configuration;

namespace NasaExplorer.Infrastructure.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;

    public string Issuer { get; set; } = "NasaExplorer";

    public string Audience { get; set; } = "NasaExplorerClient";

    public int AccessTokenMinutes { get; set; } = 60;

    public static JwtOptions FromConfiguration(IConfiguration configuration)
    {
        JwtOptions options = configuration
            .GetSection(SectionName)
            .Get<JwtOptions>() ?? new JwtOptions();

        options.Secret = configuration["JWT_SECRET"] ?? options.Secret;
        options.Issuer = configuration["JWT_ISSUER"] ?? options.Issuer;
        options.Audience = configuration["JWT_AUDIENCE"] ?? options.Audience;

        if (int.TryParse(configuration["JWT_ACCESS_TOKEN_MINUTES"], out int accessTokenMinutes))
        {
            options.AccessTokenMinutes = accessTokenMinutes;
        }

        return options;
    }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Secret))
        {
            throw new InvalidOperationException("JWT secret is not configured.");
        }

        if (string.IsNullOrWhiteSpace(Issuer))
        {
            throw new InvalidOperationException("JWT issuer is not configured.");
        }

        if (string.IsNullOrWhiteSpace(Audience))
        {
            throw new InvalidOperationException("JWT audience is not configured.");
        }

        if (AccessTokenMinutes <= 0)
        {
            throw new InvalidOperationException("JWT access token lifetime must be greater than zero.");
        }
    }
}
