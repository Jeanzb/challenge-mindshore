using Microsoft.EntityFrameworkCore;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        DateTimeOffset createdAt = DateTimeOffset.UtcNow;
        User demoUser = User.Create(
            "demo@nasaexplorer.com",
            BCrypt.Net.BCrypt.HashPassword("Demo1234!", workFactor: 12),
            "Demo User",
            createdAt);

        Collection marsCollection = Collection.Create(
            demoUser.Id,
            "Mars Exploration",
            "Iconic images from Mars exploration and rover missions",
            createdAt);

        Collection apolloCollection = Collection.Create(
            demoUser.Id,
            "Apollo Missions",
            "Historic photographs from the Apollo program",
            createdAt);

        await context.Users.AddAsync(demoUser);
        await context.Collections.AddRangeAsync(marsCollection, apolloCollection);
        await context.SaveChangesAsync();
    }
}
