namespace NasaExplorer.Infrastructure.ExternalServices.OpenAi;

public static class OpenAiPrompts
{
    public const string EnrichImage = "Generate a compact JSON object with description, funFacts, and historicalContext for a NASA space image.";

    public const string CompareImages = "Compare the provided NASA space images for a space exploration app. "
        + "Return ONLY a valid JSON object, with no markdown, no code fences, and no text outside the JSON. "
        + "Use exactly these keys: \"title\" (string), \"summary\" (string), \"similarities\" (array of strings), "
        + "\"differences\" (array of strings), \"historicalContext\" (string), \"scientificValue\" (string), "
        + "\"conclusion\" (string). Keep each string concise and free of markdown symbols such as asterisks.";

    public const string SuggestTags = "Suggest concise lowercase tags for a NASA space image. Return only a JSON array of strings.";

    public const string SemanticSearch = "Transform a natural language space image search into concise English NASA Image and Video Library search tags. "
        + "Translate non-English terms into common English astronomy, mission, rover, camera, and visual keywords. "
        + "Prefer tags such as sunset, sunrise, horizon, crater, mars, curiosity, navcam, telescope, nebula, galaxy, aurora, earth observation. "
        + "Return plain text only, with no punctuation or explanation.";
}
