namespace NasaExplorer.Domain.Constants;

public static class ImageTagSources
{
    public const string Manual = "manual";
    public const string Ai = "ai";

    public static bool IsValid(string source)
    {
        return source is Manual or Ai;
    }
}
