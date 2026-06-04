using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Exports;
using System.Text;

namespace NasaExplorer.Infrastructure.Exports;

public sealed class PdfCollectionExportFileService : ICollectionExportFileService
{
    private const int MaxLineLength = 88;
    private const int MaxLinesPerPage = 42;
    private static readonly Encoding PdfEncoding = Encoding.ASCII;

    public Task<CollectionExportFile> CreatePdfAsync(Collection collection, CancellationToken cancellationToken = default)
    {
        IReadOnlyCollection<string> lines = BuildLines(collection);
        byte[] content = BuildPdf(lines);

        return Task.FromResult(new CollectionExportFile(
            BuildFileName(collection.Name),
            "application/pdf",
            content));
    }

    private static IReadOnlyCollection<string> BuildLines(Collection collection)
    {
        List<string> lines =
        [
            "MindShore Space Explorer",
            $"Collection: {collection.Name}",
            $"Description: {collection.Description ?? "No description"}",
            $"Generated at: {DateTimeOffset.UtcNow:yyyy-MM-dd HH:mm:ss} UTC",
            string.Empty,
            "Images"
        ];

        foreach (CollectionImage collectionImage in collection.Images.OrderBy(image => image.SortOrder))
        {
            if (collectionImage.SpaceImage is null)
            {
                continue;
            }

            lines.Add(string.Empty);
            lines.Add($"{collectionImage.SortOrder + 1}. {collectionImage.SpaceImage.Title}");
            lines.Add($"NASA ID: {collectionImage.SpaceImage.NasaId}");
            lines.Add($"Image: {collectionImage.SpaceImage.ImageUrl}");

            if (collectionImage.SpaceImage.DateCreated.HasValue)
            {
                lines.Add($"Date: {collectionImage.SpaceImage.DateCreated:yyyy-MM-dd}");
            }

            if (!string.IsNullOrWhiteSpace(collectionImage.UserNote))
            {
                lines.Add($"Note: {collectionImage.UserNote}");
            }

            if (!string.IsNullOrWhiteSpace(collectionImage.SpaceImage.Description))
            {
                lines.Add($"Description: {collectionImage.SpaceImage.Description}");
            }
        }

        return lines.SelectMany(line => WrapLine(line)).ToArray();
    }

    private static byte[] BuildPdf(IReadOnlyCollection<string> lines)
    {
        IReadOnlyCollection<IReadOnlyCollection<string>> pages = lines
            .Chunk(MaxLinesPerPage)
            .Select(chunk => (IReadOnlyCollection<string>)chunk)
            .DefaultIfEmpty(["No collection content."])
            .ToArray();
        int pageCount = pages.Count;
        int fontObjectId = 3 + pageCount * 2;
        Dictionary<int, string> objects = new()
        {
            [1] = "<< /Type /Catalog /Pages 2 0 R >>",
            [2] = $"<< /Type /Pages /Kids [{string.Join(" ", Enumerable.Range(0, pageCount).Select(index => $"{3 + index * 2} 0 R"))}] /Count {pageCount} >>"
        };

        int pageIndex = 0;
        foreach (IReadOnlyCollection<string> pageLines in pages)
        {
            int pageObjectId = 3 + pageIndex * 2;
            int contentObjectId = pageObjectId + 1;
            string pageContent = BuildPageContent(pageLines);
            int pageContentLength = PdfEncoding.GetByteCount(pageContent);

            objects[pageObjectId] = $"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 {fontObjectId} 0 R >> >> /Contents {contentObjectId} 0 R >>";
            objects[contentObjectId] = $"<< /Length {pageContentLength} >>\nstream\n{pageContent}\nendstream";
            pageIndex++;
        }

        objects[fontObjectId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

        return WritePdf(objects);
    }

    private static string BuildPageContent(IReadOnlyCollection<string> lines)
    {
        StringBuilder builder = new();
        builder.AppendLine("BT");
        builder.AppendLine("/F1 11 Tf");
        builder.AppendLine("50 742 Td");

        bool firstLine = true;
        foreach (string line in lines)
        {
            if (!firstLine)
            {
                builder.AppendLine("0 -16 Td");
            }

            builder.AppendLine($"({EscapePdfText(line)}) Tj");
            firstLine = false;
        }

        builder.AppendLine("ET");

        return builder.ToString();
    }

    private static byte[] WritePdf(Dictionary<int, string> objects)
    {
        using MemoryStream stream = new();
        Write(stream, "%PDF-1.4\n");
        int maxObjectId = objects.Keys.Max();
        long[] offsets = new long[maxObjectId + 1];

        foreach (int objectId in objects.Keys.OrderBy(id => id))
        {
            offsets[objectId] = stream.Position;
            Write(stream, $"{objectId} 0 obj\n{objects[objectId]}\nendobj\n");
        }

        long xrefOffset = stream.Position;
        Write(stream, $"xref\n0 {maxObjectId + 1}\n");
        Write(stream, "0000000000 65535 f \n");

        for (int objectId = 1; objectId <= maxObjectId; objectId++)
        {
            Write(stream, $"{offsets[objectId]:0000000000} 00000 n \n");
        }

        Write(stream, $"trailer\n<< /Size {maxObjectId + 1} /Root 1 0 R >>\nstartxref\n{xrefOffset}\n%%EOF");

        return stream.ToArray();
    }

    private static IReadOnlyCollection<string> WrapLine(string line)
    {
        string asciiLine = ToAscii(line);
        if (asciiLine.Length <= MaxLineLength)
        {
            return [asciiLine];
        }

        List<string> lines = [];
        string remaining = asciiLine;
        while (remaining.Length > MaxLineLength)
        {
            int splitIndex = remaining.LastIndexOf(' ', MaxLineLength);
            if (splitIndex <= 0)
            {
                splitIndex = MaxLineLength;
            }

            lines.Add(remaining[..splitIndex].Trim());
            remaining = remaining[splitIndex..].Trim();
        }

        if (remaining.Length > 0)
        {
            lines.Add(remaining);
        }

        return lines;
    }

    private static string BuildFileName(string collectionName)
    {
        string sanitizedName = string.Join(
            '-',
            ToAscii(collectionName)
                .ToLowerInvariant()
                .Split([' ', '.', ',', ':', ';', '/', '\\', '_'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));

        return $"{(string.IsNullOrWhiteSpace(sanitizedName) ? "collection" : sanitizedName)}-{DateTimeOffset.UtcNow:yyyyMMddHHmmss}.pdf";
    }

    private static string EscapePdfText(string value)
    {
        return value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("(", "\\(", StringComparison.Ordinal)
            .Replace(")", "\\)", StringComparison.Ordinal);
    }

    private static string ToAscii(string value)
    {
        return string.Concat(value.Select(character => character is >= ' ' and <= '~' ? character : '?'));
    }

    private static void Write(Stream stream, string value)
    {
        byte[] bytes = PdfEncoding.GetBytes(value);
        stream.Write(bytes, 0, bytes.Length);
    }
}
