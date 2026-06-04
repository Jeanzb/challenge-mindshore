namespace NasaExplorer.Domain.Models.Exports;

public sealed record CollectionExportFile(
    string FileName,
    string ContentType,
    byte[] Content);
