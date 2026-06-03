using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NasaExplorer.Infrastructure.ExternalServices.NasaApi;

public sealed class NasaApiService : INasaApiService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public NasaApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<NasaSearchResult> SearchImagesAsync(NasaSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        using HttpResponseMessage response = await _httpClient.GetAsync(BuildSearchUri(criteria), cancellationToken);
        response.EnsureSuccessStatusCode();

        await using Stream stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        NasaSearchResponse? nasaResponse = await JsonSerializer.DeserializeAsync<NasaSearchResponse>(stream, JsonOptions, cancellationToken);

        IReadOnlyCollection<NasaImageAsset> images = (nasaResponse?.Collection?.Items ?? [])
            .Select(ToImageAsset)
            .OfType<NasaImageAsset>()
            .Where(image => MatchesDateRange(image, criteria))
            .ToArray();

        return new NasaSearchResult(
            images,
            HasLocalDateFilter(criteria) ? images.Count : (nasaResponse?.Collection?.Metadata?.TotalHits ?? images.Count),
            criteria.Page,
            criteria.PageSize);
    }

    public async Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(string nasaImageId, CancellationToken cancellationToken = default)
    {
        string requestUri = $"asset/{Uri.EscapeDataString(nasaImageId)}";

        using HttpResponseMessage response = await _httpClient.GetAsync(requestUri, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using Stream stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        NasaAssetResponse? assetResponse = await JsonSerializer.DeserializeAsync<NasaAssetResponse>(stream, JsonOptions, cancellationToken);

        return (assetResponse?.Collection?.Items ?? [])
            .Where(item => !string.IsNullOrWhiteSpace(item.Href))
            .Select(item => new NasaAssetFile(
                item.Href,
                ResolveAssetRel(item.Href),
                ResolveAssetRender(item.Href),
                null,
                null,
                null))
            .ToArray();
    }

    private static string BuildSearchUri(NasaSearchCriteria criteria)
    {
        List<KeyValuePair<string, string>> parameters =
        [
            new("q", string.Join(' ', BuildSearchTerms(criteria))),
            new("media_type", "image"),
            new("page", criteria.Page.ToString(CultureInfo.InvariantCulture)),
            new("page_size", criteria.PageSize.ToString(CultureInfo.InvariantCulture))
        ];

        if (criteria.DateFrom.HasValue)
        {
            parameters.Add(new KeyValuePair<string, string>("year_start", criteria.DateFrom.Value.Year.ToString(CultureInfo.InvariantCulture)));
        }

        if (criteria.DateTo.HasValue)
        {
            parameters.Add(new KeyValuePair<string, string>("year_end", criteria.DateTo.Value.Year.ToString(CultureInfo.InvariantCulture)));
        }

        string queryString = string.Join(
            '&',
            parameters.Select(parameter => $"{Uri.EscapeDataString(parameter.Key)}={Uri.EscapeDataString(parameter.Value)}"));

        return $"search?{queryString}";
    }

    private static IEnumerable<string> BuildSearchTerms(NasaSearchCriteria criteria)
    {
        string[] terms =
        [
            criteria.Query,
            criteria.Rover ?? string.Empty,
            criteria.Camera ?? string.Empty,
            criteria.Mission ?? string.Empty
        ];

        return terms
            .Select(term => term.Trim())
            .Where(term => !string.IsNullOrWhiteSpace(term))
            .Distinct(StringComparer.OrdinalIgnoreCase);
    }

    private static NasaImageAsset? ToImageAsset(NasaSearchItem item)
    {
        NasaSearchItemData? data = item.Data?.FirstOrDefault();

        if (data is null || string.IsNullOrWhiteSpace(data.NasaId))
        {
            return null;
        }

        string? imageUrl = SelectImageUrl(item.Links ?? []);
        string? thumbnailUrl = SelectThumbnailUrl(item.Links ?? [], imageUrl);

        if (string.IsNullOrWhiteSpace(imageUrl) || string.IsNullOrWhiteSpace(thumbnailUrl))
        {
            return null;
        }

        return new NasaImageAsset(
            data.NasaId,
            string.IsNullOrWhiteSpace(data.Title) ? data.NasaId : data.Title,
            data.Description,
            data.Center,
            string.IsNullOrWhiteSpace(data.MediaType) ? "image" : data.MediaType,
            thumbnailUrl,
            imageUrl,
            $"https://images.nasa.gov/details/{Uri.EscapeDataString(data.NasaId)}",
            data.DateCreated,
            (data.Keywords ?? [])
                .Where(keyword => !string.IsNullOrWhiteSpace(keyword))
                .Select(keyword => keyword.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray());
    }

    private static string? SelectImageUrl(IReadOnlyCollection<NasaSearchLink> links)
    {
        NasaSearchLink[] webImageLinks = links
            .Where(link => IsWebImageLink(link.Href))
            .ToArray();

        return SelectPreferredLink(webImageLinks, "~large", "~medium", "~small", "~thumb")
            ?? SelectPreferredLink(links.Where(link => IsImageRender(link)).ToArray(), "~large", "~medium", "~small", "~thumb");
    }

    private static string? SelectThumbnailUrl(IReadOnlyCollection<NasaSearchLink> links, string? imageUrl)
    {
        string? preview = links.FirstOrDefault(link =>
            string.Equals(link.Rel, "preview", StringComparison.OrdinalIgnoreCase)
            && IsWebImageLink(link.Href))?.Href;

        return preview
            ?? SelectPreferredLink(links.Where(link => IsWebImageLink(link.Href)).ToArray(), "~thumb")
            ?? imageUrl;
    }

    private static string? SelectPreferredLink(IReadOnlyCollection<NasaSearchLink> links, params string[] priorities)
    {
        foreach (string priority in priorities)
        {
            string? link = links.FirstOrDefault(item =>
                item.Href.Contains(priority, StringComparison.OrdinalIgnoreCase))?.Href;

            if (!string.IsNullOrWhiteSpace(link))
            {
                return link;
            }
        }

        return links.FirstOrDefault(link => !string.IsNullOrWhiteSpace(link.Href))?.Href;
    }

    private static bool MatchesDateRange(NasaImageAsset image, NasaSearchCriteria criteria)
    {
        if (!HasLocalDateFilter(criteria))
        {
            return true;
        }

        if (!image.DateCreated.HasValue)
        {
            return false;
        }

        DateOnly imageDate = DateOnly.FromDateTime(image.DateCreated.Value.UtcDateTime);

        return (!criteria.DateFrom.HasValue || imageDate >= criteria.DateFrom.Value)
            && (!criteria.DateTo.HasValue || imageDate <= criteria.DateTo.Value);
    }

    private static bool HasLocalDateFilter(NasaSearchCriteria criteria)
    {
        return criteria.DateFrom.HasValue || criteria.DateTo.HasValue;
    }

    private static bool IsImageRender(NasaSearchLink link)
    {
        return !string.IsNullOrWhiteSpace(link.Href)
            && string.Equals(link.Render, "image", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsWebImageLink(string href)
    {
        return href.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
            || href.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
            || href.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
            || href.EndsWith(".gif", StringComparison.OrdinalIgnoreCase)
            || href.EndsWith(".webp", StringComparison.OrdinalIgnoreCase);
    }

    private static string? ResolveAssetRel(string href)
    {
        if (href.EndsWith("metadata.json", StringComparison.OrdinalIgnoreCase))
        {
            return "metadata";
        }

        if (href.Contains("~thumb", StringComparison.OrdinalIgnoreCase))
        {
            return "preview";
        }

        if (href.Contains("~orig", StringComparison.OrdinalIgnoreCase))
        {
            return "canonical";
        }

        return "alternate";
    }

    private static string? ResolveAssetRender(string href)
    {
        if (href.EndsWith("metadata.json", StringComparison.OrdinalIgnoreCase))
        {
            return "metadata";
        }

        return IsWebImageLink(href) || href.EndsWith(".tif", StringComparison.OrdinalIgnoreCase)
            ? "image"
            : null;
    }

    private sealed class NasaSearchResponse
    {
        public NasaSearchCollection? Collection { get; set; }
    }

    private sealed class NasaSearchCollection
    {
        public IReadOnlyCollection<NasaSearchItem>? Items { get; set; }

        public NasaSearchMetadata? Metadata { get; set; }
    }

    private sealed class NasaSearchMetadata
    {
        [JsonPropertyName("total_hits")]
        public int TotalHits { get; set; }
    }

    private sealed class NasaSearchItem
    {
        public IReadOnlyCollection<NasaSearchItemData>? Data { get; set; }

        public IReadOnlyCollection<NasaSearchLink>? Links { get; set; }
    }

    private sealed class NasaSearchItemData
    {
        public string? Center { get; set; }

        [JsonPropertyName("date_created")]
        public DateTimeOffset? DateCreated { get; set; }

        public string? Description { get; set; }

        public IReadOnlyCollection<string>? Keywords { get; set; }

        [JsonPropertyName("media_type")]
        public string? MediaType { get; set; }

        [JsonPropertyName("nasa_id")]
        public string? NasaId { get; set; }

        public string? Title { get; set; }
    }

    private sealed class NasaSearchLink
    {
        public string Href { get; set; } = string.Empty;

        public string? Rel { get; set; }

        public string? Render { get; set; }
    }

    private sealed class NasaAssetResponse
    {
        public NasaAssetCollection? Collection { get; set; }
    }

    private sealed class NasaAssetCollection
    {
        public IReadOnlyCollection<NasaAssetItem>? Items { get; set; }
    }

    private sealed class NasaAssetItem
    {
        public string Href { get; set; } = string.Empty;
    }
}
