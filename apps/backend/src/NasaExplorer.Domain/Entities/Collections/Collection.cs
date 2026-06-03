using NasaExplorer.Domain.Common;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Domain.Entities.Collections;

public sealed class Collection
{
    private Collection()
    {
        Name = string.Empty;
        Images = [];
    }

    private Collection(Guid userId, string name, string? description, DateTimeOffset createdAt)
    {
        Id = Guid.NewGuid();
        UserId = Guard.AgainstEmpty(userId, nameof(userId));
        Name = Guard.AgainstNullOrWhiteSpace(name, nameof(name), DomainConstraints.Collections.NameMaxLength);
        Description = Guard.OptionalString(description, nameof(description), DomainConstraints.Collections.DescriptionMaxLength);
        CreatedAt = Guard.AgainstDefault(createdAt, nameof(createdAt));
        UpdatedAt = CreatedAt;
        Images = [];
    }

    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string Name { get; private set; }

    public string? Description { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public bool IsDeleted { get; private set; }

    public DateTimeOffset? DeletedAt { get; private set; }

    public ICollection<CollectionImage> Images { get; private set; }

    public static Collection Create(Guid userId, string name, string? description, DateTimeOffset createdAt)
    {
        return new Collection(userId, name, description, createdAt);
    }

    public void Update(string name, string? description, DateTimeOffset updatedAt)
    {
        Name = Guard.AgainstNullOrWhiteSpace(name, nameof(name), DomainConstraints.Collections.NameMaxLength);
        Description = Guard.OptionalString(description, nameof(description), DomainConstraints.Collections.DescriptionMaxLength);
        UpdatedAt = Guard.AgainstDefault(updatedAt, nameof(updatedAt));
    }

    public void Delete(DateTimeOffset deletedAt)
    {
        IsDeleted = true;
        DeletedAt = Guard.AgainstDefault(deletedAt, nameof(deletedAt));
        UpdatedAt = DeletedAt.Value;
    }
}
