namespace NasaExplorer.Infrastructure.ExternalServices.NasaApi;

public sealed class NasaApiOptions
{
    public const string SectionName = "NasaApi";

    public string BaseUrl { get; set; } = "https://images-api.nasa.gov";

    public string ApiKey { get; set; } = string.Empty;
}
