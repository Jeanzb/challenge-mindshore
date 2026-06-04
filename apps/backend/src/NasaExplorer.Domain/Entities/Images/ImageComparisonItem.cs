using NasaExplorer.Domain.Common;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageComparisonItem
{
    private ImageComparisonItem()
    {
    }

    private ImageComparisonItem(Guid imageComparisonId, Guid spaceImageId, int sortOrder)
    {
        if (sortOrder < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sortOrder), "Sort order cannot be negative.");
        }

        Id = Guid.NewGuid();
        ImageComparisonId = Guard.AgainstEmpty(imageComparisonId, nameof(imageComparisonId));
        SpaceImageId = Guard.AgainstEmpty(spaceImageId, nameof(spaceImageId));
        SortOrder = sortOrder;
    }

    public Guid Id { get; private set; }

    public Guid ImageComparisonId { get; private set; }

    public Guid SpaceImageId { get; private set; }

    public int SortOrder { get; private set; }

    public ImageComparison? ImageComparison { get; private set; }

    public SpaceImage? SpaceImage { get; private set; }

    public static ImageComparisonItem Create(Guid imageComparisonId, Guid spaceImageId, int sortOrder)
    {
        return new ImageComparisonItem(imageComparisonId, spaceImageId, sortOrder);
    }
}
