using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class Tag
{
    private Tag()
    {
        Name = string.Empty;
        NormalizedName = string.Empty;
        ImageTags = [];
    }

    private Tag(Guid? userId, string name, bool isAiGenerated, DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        UserId = userId.HasValue ? Guard.AgainstEmpty(userId.Value, nameof(userId)) : null;
        Name = Guard.AgainstNullOrWhiteSpace(name, nameof(name), DomainConstraints.Tags.NameMaxLength);
        NormalizedName = NormalizeName(Name);
        IsAiGenerated = isAiGenerated;
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
        ImageTags = [];
    }

    public Guid Id { get; private set; }

    public Guid? UserId { get; private set; }

    public string Name { get; private set; }

    public string NormalizedName { get; private set; }

    public bool IsAiGenerated { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public ICollection<ImageTag> ImageTags { get; private set; }

    public static Tag Create(Guid? userId, string name, bool isAiGenerated, DateTimeOffset createdAt)
    {
        return new Tag(userId, name, isAiGenerated, createdAt);
    }

    public static string NormalizeName(string name)
    {
        return Guard.AgainstNullOrWhiteSpace(name, nameof(name), DomainConstraints.Tags.NormalizedNameMaxLength)
            .ToLowerInvariant();
    }
}
