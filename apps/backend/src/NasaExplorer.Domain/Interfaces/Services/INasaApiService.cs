using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Domain.Interfaces.Services;

public interface INasaApiService
{
    Task<NasaSearchResult> SearchImagesAsync(NasaSearchCriteria criteria, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(string nasaImageId, CancellationToken cancellationToken = default);
}
