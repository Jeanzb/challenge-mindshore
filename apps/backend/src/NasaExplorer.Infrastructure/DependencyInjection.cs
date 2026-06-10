using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Infrastructure.Auth;
using NasaExplorer.Infrastructure.Exports;
using NasaExplorer.Infrastructure.ExternalServices.NasaApi;
using NasaExplorer.Infrastructure.ExternalServices.OpenAi;
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
        services.AddScoped<IImageComparisonRepository, ImageComparisonRepository>();
        services.AddScoped<ISpaceImageRepository, SpaceImageRepository>();
        services.AddScoped<ITagRepository, TagRepository>();
        services.AddScoped<ICollectionExportRepository, CollectionExportRepository>();
        services.AddScoped<ICollectionExportFileService, PdfCollectionExportFileService>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddMemoryCache();
        services.Configure<NasaApiOptions>(options =>
        {
            options.BaseUrl = config["NASA_API_BASE_URL"]
                ?? config[$"{NasaApiOptions.SectionName}:BaseUrl"]
                ?? "https://images-api.nasa.gov";
            options.ApiKey = config["NASA_API_KEY"]
                ?? config[$"{NasaApiOptions.SectionName}:ApiKey"]
                ?? string.Empty;
            options.SearchCacheMinutes = ReadPositiveInt(
                config["NASA_SEARCH_CACHE_MINUTES"],
                config[$"{NasaApiOptions.SectionName}:SearchCacheMinutes"],
                15);
            options.AssetManifestCacheHours = ReadPositiveInt(
                config["NASA_ASSET_CACHE_HOURS"],
                config[$"{NasaApiOptions.SectionName}:AssetManifestCacheHours"],
                12);
        });
        services.AddHttpClient<NasaApiService>((serviceProvider, client) =>
        {
            NasaApiOptions options = serviceProvider.GetRequiredService<IOptions<NasaApiOptions>>().Value;

            client.BaseAddress = new Uri(options.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(20);
        });
        services.AddScoped<INasaApiService, CachedNasaApiService>();
        services.Configure<OpenAiOptions>(options =>
        {
            options.BaseUrl = config["AI_BASE_URL"]
                ?? config["OPENAI_BASE_URL"]
                ?? config[$"{OpenAiOptions.SectionName}:BaseUrl"]
                ?? "https://generativelanguage.googleapis.com/v1beta/openai/";
            options.ApiKey = config["AI_API_KEY"]
                ?? config["OPENAI_API_KEY"]
                ?? config[$"{OpenAiOptions.SectionName}:ApiKey"]
                ?? string.Empty;
            options.Model = config["AI_MODEL"]
                ?? config["OPENAI_MODEL"]
                ?? config[$"{OpenAiOptions.SectionName}:Model"]
                ?? "gemini-2.5-flash";
        });
        services.AddHttpClient<IAiEnrichmentService, AiEnrichmentService>((serviceProvider, client) =>
        {
            OpenAiOptions options = serviceProvider.GetRequiredService<IOptions<OpenAiOptions>>().Value;

            client.BaseAddress = new Uri(options.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(30);
        });
        services.Configure<JwtOptions>(options =>
        {
            JwtOptions configuredOptions = JwtOptions.FromConfiguration(config);

            options.Secret = configuredOptions.Secret;
            options.Issuer = configuredOptions.Issuer;
            options.Audience = configuredOptions.Audience;
            options.AccessTokenMinutes = configuredOptions.AccessTokenMinutes;
        });
        services.AddScoped<IPasswordHashService, PasswordHashService>();
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }

    private static int ReadPositiveInt(string? environmentValue, string? configuredValue, int fallback)
    {
        string? value = environmentValue ?? configuredValue;

        return int.TryParse(value, out int parsedValue) && parsedValue > 0
            ? parsedValue
            : fallback;
    }
}
