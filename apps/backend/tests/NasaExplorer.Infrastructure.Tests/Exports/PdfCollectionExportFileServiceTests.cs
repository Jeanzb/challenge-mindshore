using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Infrastructure.Exports;
using System.Text;
using System.Reflection;

namespace NasaExplorer.Infrastructure.Tests.Exports;

public sealed class PdfCollectionExportFileServiceTests
{
    [Fact]
    public async Task CreatePdfAsync_returns_pdf_file_for_collection()
    {
        Collection collection = Collection.Create(Guid.NewGuid(), "Mars Collection", "Mars images", DateTimeOffset.UtcNow);
        SpaceImage spaceImage = SpaceImage.Create(
            "mars-1",
            "Mars 1",
            "NASA description",
            "https://images.test/mars-1.jpg",
            "https://images.test/mars-1-thumb.jpg",
            "https://images.nasa.gov/details/mars-1",
            "image",
            "JPL",
            "Mars",
            "Perseverance",
            "Mastcam",
            DateTimeOffset.UtcNow,
            "mars",
            DateTimeOffset.UtcNow);
        CollectionImage collectionImage = CollectionImage.Create(collection.Id, spaceImage.Id, "Important image", 0, DateTimeOffset.UtcNow);
        typeof(CollectionImage)
            .GetProperty(nameof(CollectionImage.SpaceImage), BindingFlags.Instance | BindingFlags.Public)!
            .SetValue(collectionImage, spaceImage);
        collection.Images.Add(collectionImage);
        PdfCollectionExportFileService service = new();

        Domain.Models.Exports.CollectionExportFile file = await service.CreatePdfAsync(collection);
        string content = Encoding.ASCII.GetString(file.Content);

        Assert.Equal("application/pdf", file.ContentType);
        Assert.StartsWith("mars-collection-", file.FileName);
        Assert.EndsWith(".pdf", file.FileName);
        Assert.StartsWith("%PDF-1.4", content);
        Assert.Contains("Mars Collection", content);
        Assert.Contains("Mars 1", content);
    }
}
