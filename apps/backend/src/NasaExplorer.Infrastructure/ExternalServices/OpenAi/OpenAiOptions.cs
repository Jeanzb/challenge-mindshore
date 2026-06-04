namespace NasaExplorer.Infrastructure.ExternalServices.OpenAi;

public sealed class OpenAiOptions
{
    public const string SectionName = "OpenAi";

    public string BaseUrl { get; set; } = "https://api.openai.com/v1/";

    public string ApiKey { get; set; } = string.Empty;

    public string Model { get; set; } = "gpt-4o-mini";
}
