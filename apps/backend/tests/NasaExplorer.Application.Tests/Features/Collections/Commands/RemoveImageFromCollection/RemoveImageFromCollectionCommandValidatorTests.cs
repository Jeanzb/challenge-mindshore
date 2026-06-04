using NasaExplorer.Application.Features.Collections.Commands.RemoveImageFromCollection;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.RemoveImageFromCollection;

public sealed class RemoveImageFromCollectionCommandValidatorTests
{
    [Fact]
    public void Validate_accepts_valid_command()
    {
        RemoveImageFromCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new RemoveImageFromCollectionCommand(Guid.NewGuid(), Guid.NewGuid()));

        Assert.True(result.IsValid);
    }

    [Fact]
    public void Validate_rejects_empty_collection_id()
    {
        RemoveImageFromCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new RemoveImageFromCollectionCommand(Guid.Empty, Guid.NewGuid()));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(RemoveImageFromCollectionCommand.CollectionId));
    }

    [Fact]
    public void Validate_rejects_empty_image_id()
    {
        RemoveImageFromCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new RemoveImageFromCollectionCommand(Guid.NewGuid(), Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(RemoveImageFromCollectionCommand.ImageId));
    }
}
