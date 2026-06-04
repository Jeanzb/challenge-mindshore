using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageComparison
{
    private ImageComparison()
    {
        Analysis = string.Empty;
        Items = [];
    }

    private ImageComparison(
        Guid userId,
        string? title,
        string analysis,
        string? prompt,
        string? model,
        DateTimeOffset createdAt,
        IReadOnlyCollection<Guid> spaceImageIds)
    {
        Id = Guid.NewGuid();
        UserId = Guard.AgainstEmpty(userId, nameof(userId));
        Title = Guard.OptionalString(title, nameof(title), DomainConstraints.ImageComparisons.TitleMaxLength);
        Analysis = Guard.AgainstNullOrWhiteSpace(analysis, nameof(analysis), DomainConstraints.ImageComparisons.AnalysisMaxLength);
        Prompt = Guard.OptionalString(prompt, nameof(prompt), DomainConstraints.ImageComparisons.PromptMaxLength);
        Model = Guard.OptionalString(model, nameof(model), DomainConstraints.ImageComparisons.ModelMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
        ArgumentNullException.ThrowIfNull(spaceImageIds);

        if (spaceImageIds.Count < DomainConstraints.ImageComparisons.MinimumImageCount)
        {
            throw new ArgumentException("A comparison requires at least two images.", nameof(spaceImageIds));
        }

        if (spaceImageIds.Distinct().Count() != spaceImageIds.Count)
        {
            throw new ArgumentException("A comparison cannot include duplicate images.", nameof(spaceImageIds));
        }

        Items = spaceImageIds
            .Select((spaceImageId, index) => ImageComparisonItem.Create(Id, spaceImageId, index))
            .ToList();
    }

    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string? Title { get; private set; }

    public string Analysis { get; private set; }

    public string? Prompt { get; private set; }

    public string? Model { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public ICollection<ImageComparisonItem> Items { get; private set; }

    public static ImageComparison Create(
        Guid userId,
        string? title,
        string analysis,
        string? prompt,
        string? model,
        DateTimeOffset createdAt,
        IReadOnlyCollection<Guid> spaceImageIds)
    {
        return new ImageComparison(userId, title, analysis, prompt, model, createdAt, spaceImageIds);
    }
}
