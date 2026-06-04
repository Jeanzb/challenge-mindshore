namespace NasaExplorer.Application.DTOs.Collections;

public sealed class ImageTagDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public bool IsAiGenerated { get; set; }
}
