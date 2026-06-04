namespace NasaExplorer.Application.DTOs.Exports;

public sealed class CollectionExportResultDto
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public byte[] Content { get; set; } = [];

    public DateTimeOffset CreatedAt { get; set; }
}
