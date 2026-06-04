using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Infrastructure.Persistence.Repositories;

public sealed class CollectionExportRepository : ICollectionExportRepository
{
    private readonly AppDbContext _context;

    public CollectionExportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CollectionExport export, CancellationToken cancellationToken = default)
    {
        await _context.CollectionExports.AddAsync(export, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
