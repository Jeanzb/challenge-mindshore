using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Domain.Images;

public sealed class ImageComparisonTests
{
    [Fact]
    public void Create_requires_at_least_two_images()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => ImageComparison.Create(
            Guid.NewGuid(),
            "Mars views",
            "Analysis",
            null,
            "gpt-4o-mini",
            DateTimeOffset.UtcNow,
            [Guid.NewGuid()]));

        Assert.Equal("spaceImageIds", exception.ParamName);
    }

    [Fact]
    public void Create_rejects_empty_image_ids()
    {
        ArgumentException exception = Assert.Throws<ArgumentException>(() => ImageComparison.Create(
            Guid.NewGuid(),
            "Mars views",
            "Analysis",
            null,
            "gpt-4o-mini",
            DateTimeOffset.UtcNow,
            [Guid.Empty, Guid.NewGuid()]));

        Assert.Equal("spaceImageId", exception.ParamName);
    }

    [Fact]
    public void Create_rejects_duplicate_images()
    {
        Guid imageId = Guid.NewGuid();

        ArgumentException exception = Assert.Throws<ArgumentException>(() => ImageComparison.Create(
            Guid.NewGuid(),
            "Mars views",
            "Analysis",
            null,
            "gpt-4o-mini",
            DateTimeOffset.UtcNow,
            [imageId, imageId]));

        Assert.Equal("spaceImageIds", exception.ParamName);
    }

    [Fact]
    public void Create_preserves_compared_image_order()
    {
        Guid firstImageId = Guid.NewGuid();
        Guid secondImageId = Guid.NewGuid();
        Guid thirdImageId = Guid.NewGuid();

        ImageComparison comparison = ImageComparison.Create(
            Guid.NewGuid(),
            "Mars views",
            "Analysis",
            "Compare these images",
            "gpt-4o-mini",
            DateTimeOffset.UtcNow,
            [firstImageId, secondImageId, thirdImageId]);

        Assert.Collection(
            comparison.Items.OrderBy(item => item.SortOrder),
            item =>
            {
                Assert.Equal(firstImageId, item.SpaceImageId);
                Assert.Equal(0, item.SortOrder);
            },
            item =>
            {
                Assert.Equal(secondImageId, item.SpaceImageId);
                Assert.Equal(1, item.SortOrder);
            },
            item =>
            {
                Assert.Equal(thirdImageId, item.SpaceImageId);
                Assert.Equal(2, item.SortOrder);
            });
    }
}
