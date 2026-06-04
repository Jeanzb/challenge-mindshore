namespace NasaExplorer.Infrastructure.ExternalServices.OpenAi;

public static class OpenAiPrompts
{
    public const string EnrichImage = "Generate a compact JSON object with description, funFacts, and historicalContext for a NASA space image.";

    public const string CompareImages = "Compare the provided NASA images and return a concise narrative analysis for a space exploration app.";

    public const string SuggestTags = "Suggest concise lowercase tags for a NASA space image. Return only a JSON array of strings.";

    public const string SemanticSearch = "Transform a natural language space image search into a short NASA image search query. Return plain text only.";
}
