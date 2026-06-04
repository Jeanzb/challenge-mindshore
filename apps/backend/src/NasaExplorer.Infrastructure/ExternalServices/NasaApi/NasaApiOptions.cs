namespace NasaExplorer.Infrastructure.ExternalServices.NasaApi;

public sealed class NasaApiOptions
{
    public const string SectionName = "NasaApi";

    public string BaseUrl { get; set; } = "https://images-api.nasa.gov";

    public string ApiKey { get; set; } = string.Empty;

    public int SearchCacheMinutes { get; set; } = 15;

    public int AssetManifestCacheHours { get; set; } = 12;
}
