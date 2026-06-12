using NasaExplorer.Application.Features.Collections.Commands.UpdateCollection;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.UpdateCollection;

public sealed class UpdateCollectionCommandValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_id()
    {
        UpdateCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(new UpdateCollectionCommand(Guid.Empty, "Mars", null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionCommand.Id));
    }

    [Fact]
    public void Validate_rejects_empty_name()
    {
        UpdateCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(new UpdateCollectionCommand(Guid.NewGuid(), " ", null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionCommand.Name));
    }

    [Fact]
    public void Validate_rejects_too_long_description()
    {
        UpdateCollectionCommandValidator validator = new();
        string description = new('x', DomainConstraints.Collections.DescriptionMaxLength + 1);

        FluentValidation.Results.ValidationResult result = validator.Validate(new UpdateCollectionCommand(Guid.NewGuid(), "Mars", description));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionCommand.Description));
    }
}
