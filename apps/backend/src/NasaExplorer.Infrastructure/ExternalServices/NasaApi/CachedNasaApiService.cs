using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;
using System.Globalization;
using System.Text.Json;

namespace NasaExplorer.Infrastructure.ExternalServices.NasaApi;

public sealed class CachedNasaApiService : INasaApiService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly NasaApiService _innerService;
    private readonly IDistributedCache _cache;
    private readonly NasaApiOptions _options;
    private readonly ILogger<CachedNasaApiService> _logger;

    public CachedNasaApiService(
        NasaApiService innerService,
        IDistributedCache cache,
        IOptions<NasaApiOptions> options,
        ILogger<CachedNasaApiService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<NasaSearchResult> SearchImagesAsync(
        NasaSearchCriteria criteria,
        CancellationToken cancellationToken = default)
    {
        string cacheKey = BuildSearchCacheKey(criteria);
        NasaSearchResult? cachedResult = await GetCachedSearchResultAsync(cacheKey, cancellationToken);

        if (cachedResult is not null)
        {
            return cachedResult;
        }

        NasaSearchResult result = await _innerService.SearchImagesAsync(criteria, cancellationToken);
        await SetCachedSearchResultAsync(cacheKey, result, cancellationToken);

        return result;
    }

    public async Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(
        string nasaImageId,
        CancellationToken cancellationToken = default)
    {
        string cacheKey = $"nasa:asset:{nasaImageId.Trim().ToLowerInvariant()}";
        IReadOnlyCollection<NasaAssetFile>? cachedFiles = await GetCachedAssetFilesAsync(cacheKey, cancellationToken);

        if (cachedFiles is not null)
        {
            return cachedFiles;
        }

        IReadOnlyCollection<NasaAssetFile> files = await _innerService.GetAssetFilesAsync(nasaImageId, cancellationToken);
        await SetCachedAssetFilesAsync(cacheKey, files, cancellationToken);

        return files;
    }

    private async Task<NasaSearchResult?> GetCachedSearchResultAsync(string cacheKey, CancellationToken cancellationToken)
    {
        string? cachedJson = await GetStringAsync(cacheKey, cancellationToken);

        return string.IsNullOrWhiteSpace(cachedJson)
            ? null
            : JsonSerializer.Deserialize<CachedNasaSearchResult>(cachedJson, JsonOptions)?.ToDomain();
    }

    private async Task SetCachedSearchResultAsync(
        string cacheKey,
        NasaSearchResult result,
        CancellationToken cancellationToken)
    {
        CachedNasaSearchResult cacheEntry = CachedNasaSearchResult.FromDomain(result);
        await SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(cacheEntry, JsonOptions),
            TimeSpan.FromMinutes(_options.SearchCacheMinutes),
            cancellationToken);
    }

    private async Task<IReadOnlyCollection<NasaAssetFile>?> GetCachedAssetFilesAsync(
        string cacheKey,
        CancellationToken cancellationToken)
    {
        string? cachedJson = await GetStringAsync(cacheKey, cancellationToken);

        return string.IsNullOrWhiteSpace(cachedJson)
            ? null
            : JsonSerializer.Deserialize<NasaAssetFile[]>(cachedJson, JsonOptions);
    }

    private async Task SetCachedAssetFilesAsync(
        string cacheKey,
        IReadOnlyCollection<NasaAssetFile> files,
        CancellationToken cancellationToken)
    {
        await SetStringAsync(
            cacheKey,
            JsonSerializer.Serialize(files.ToArray(), JsonOptions),
            TimeSpan.FromHours(_options.AssetManifestCacheHours),
            cancellationToken);
    }

    private async Task<string?> GetStringAsync(string cacheKey, CancellationToken cancellationToken)
    {
        try
        {
            return await _cache.GetStringAsync(cacheKey, cancellationToken);
        }
        catch (Exception exception)
        {
            _logger.LogWarning(exception, "NASA cache read failed for {CacheKey}", cacheKey);
            return null;
        }
    }

    private async Task SetStringAsync(
        string cacheKey,
        string value,
        TimeSpan ttl,
        CancellationToken cancellationToken)
    {
        try
        {
            await _cache.SetStringAsync(
                cacheKey,
                value,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = ttl
                },
                cancellationToken);
        }
        catch (Exception exception)
        {
            _logger.LogWarning(exception, "NASA cache write failed for {CacheKey}", cacheKey);
        }
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

    private sealed record CachedNasaSearchResult(
        NasaImageAsset[] Images,
        int TotalHits,
        int Page,
        int PageSize)
    {
        public static CachedNasaSearchResult FromDomain(NasaSearchResult result)
        {
            return new CachedNasaSearchResult(
                result.Images.ToArray(),
                result.TotalHits,
                result.Page,
                result.PageSize);
        }

        public NasaSearchResult ToDomain()
        {
            return new NasaSearchResult(Images, TotalHits, Page, PageSize);
        }
    }
}
