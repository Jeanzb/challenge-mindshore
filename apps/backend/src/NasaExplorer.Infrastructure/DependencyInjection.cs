using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NasaExplorer.Domain.Interfaces.Repositories;
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

        return services;
    }
}
