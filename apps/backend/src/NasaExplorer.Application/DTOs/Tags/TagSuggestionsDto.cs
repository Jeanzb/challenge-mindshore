namespace NasaExplorer.Application.DTOs.Tags;

public sealed class TagSuggestionsDto
{
    public IReadOnlyCollection<string> Tags { get; set; } = [];
}
