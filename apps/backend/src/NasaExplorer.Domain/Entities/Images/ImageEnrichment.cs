using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Images;

public sealed class ImageEnrichment
{
    private ImageEnrichment()
    {
        Type = string.Empty;
        Prompt = string.Empty;
        Content = string.Empty;
    }

    private ImageEnrichment(
        Guid spaceImageId,
        Guid userId,
        string type,
        string prompt,
        string content,
        string? model,
        string? provider,
        DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        SpaceImageId = Guard.AgainstEmpty(spaceImageId, nameof(spaceImageId));
        UserId = Guard.AgainstEmpty(userId, nameof(userId));
        Type = Guard.AgainstNullOrWhiteSpace(type, nameof(type), DomainConstraints.ImageEnrichments.TypeMaxLength);
        Prompt = Guard.AgainstNullOrWhiteSpace(prompt, nameof(prompt), DomainConstraints.ImageEnrichments.PromptMaxLength);
        Content = Guard.AgainstNullOrWhiteSpace(content, nameof(content), DomainConstraints.ImageEnrichments.ContentMaxLength);
        Model = Guard.OptionalString(model, nameof(model), DomainConstraints.ImageEnrichments.ModelMaxLength);
        Provider = Guard.OptionalString(provider, nameof(provider), DomainConstraints.ImageEnrichments.ProviderMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
    }

    public Guid Id { get; private set; }

    public Guid SpaceImageId { get; private set; }

    public Guid UserId { get; private set; }

    public string Type { get; private set; }

    public string Prompt { get; private set; }

    public string Content { get; private set; }

    public string? Model { get; private set; }

    public string? Provider { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public SpaceImage? SpaceImage { get; private set; }

    public static ImageEnrichment Create(
        Guid spaceImageId,
        Guid userId,
        string type,
        string prompt,
        string content,
        string? model,
        string? provider,
        DateTimeOffset createdAt)
    {
        return new ImageEnrichment(spaceImageId, userId, type, prompt, content, model, provider, createdAt);
    }
}
