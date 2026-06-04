using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;
using System.Globalization;

namespace NasaExplorer.Infrastructure.ExternalServices.NasaApi;

public sealed class CachedNasaApiService : INasaApiService
{
    private readonly NasaApiService _innerService;
    private readonly IMemoryCache _memoryCache;
    private readonly NasaApiOptions _options;

    public CachedNasaApiService(
        NasaApiService innerService,
        IMemoryCache memoryCache,
        IOptions<NasaApiOptions> options)
    {
        _innerService = innerService;
        _memoryCache = memoryCache;
        _options = options.Value;
    }

    public async Task<NasaSearchResult> SearchImagesAsync(
        NasaSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        string cacheKey = BuildSearchCacheKey(criteria);

        if (_memoryCache.TryGetValue(cacheKey, out NasaSearchResult? cachedResult) && cachedResult is not null)
        {
            return cachedResult;
        }

        NasaSearchResult result = await _innerService.SearchImagesAsync(criteria, cancellationToken);
        _memoryCache.Set(
            cacheKey,
            result,
            new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_options.SearchCacheMinutes)
            });

        return result;
    }

    public async Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(
        string nasaImageId,
        CancellationToken cancellationToken = default)
    {
        string cacheKey = $"nasa:asset:{nasaImageId.Trim().ToLowerInvariant()}";

        if (_memoryCache.TryGetValue(cacheKey, out IReadOnlyCollection<NasaAssetFile>? cachedFiles)
            && cachedFiles is not null)
        {
            return cachedFiles;
        }

        IReadOnlyCollection<NasaAssetFile> files = await _innerService.GetAssetFilesAsync(nasaImageId, cancellationToken);
        _memoryCache.Set(
            cacheKey,
            files,
            new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(_options.AssetManifestCacheHours)
            });

        return files;
    }

    private static string BuildSearchCacheKey(NasaSearchCriteria criteria)
    {
        return string.Join(
            '|',
            [
                "nasa:search",
                criteria.Query.Trim().ToLowerInvariant(),
                criteria.DateFrom?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                criteria.DateTo?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                criteria.Rover?.Trim().ToLowerInvariant() ?? string.Empty,
                criteria.Camera?.Trim().ToLowerInvariant() ?? string.Empty,
                criteria.Mission?.Trim().ToLowerInvariant() ?? string.Empty,
                criteria.Page.ToString(CultureInfo.InvariantCulture),
                criteria.PageSize.ToString(CultureInfo.InvariantCulture)
            ]);
    }
}
