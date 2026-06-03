using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Infrastructure.Auth;
using NasaExplorer.Infrastructure.ExternalServices.NasaApi;
using NasaExplorer.Infrastructure.Persistence;
using NasaExplorer.Infrastructure.Persistence.Repositories;

namespace NasaExplorer.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        string connectionString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'Default' is not configured.");

        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICollectionRepository, CollectionRepository>();
        services.AddScoped<IImageEnrichmentRepository, ImageEnrichmentRepository>();
        services.Configure<NasaApiOptions>(options =>
        {
            options.BaseUrl = config["NASA_API_BASE_URL"]
                ?? config[$"{NasaApiOptions.SectionName}:BaseUrl"]
                ?? "https://images-api.nasa.gov";
            options.ApiKey = config["NASA_API_KEY"]
                ?? config[$"{NasaApiOptions.SectionName}:ApiKey"]
                ?? string.Empty;
        });
        services.AddHttpClient<INasaApiService, NasaApiService>((serviceProvider, client) =>
        {
            NasaApiOptions options = serviceProvider.GetRequiredService<IOptions<NasaApiOptions>>().Value;

            client.BaseAddress = new Uri(options.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(20);
        });
        services.Configure<JwtOptions>(options =>
        {
            options.Secret = config["Jwt:Secret"] ?? string.Empty;
            options.Issuer = config["Jwt:Issuer"] ?? string.Empty;
            options.Audience = config["Jwt:Audience"] ?? string.Empty;
            options.AccessTokenMinutes = int.TryParse(config["Jwt:AccessTokenMinutes"], out int minutes) ? minutes : 60;
        });
        services.AddScoped<IPasswordHashService, PasswordHashService>();
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
