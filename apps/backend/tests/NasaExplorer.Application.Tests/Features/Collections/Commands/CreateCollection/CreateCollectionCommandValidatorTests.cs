using NasaExplorer.Application.Features.Collections.Commands.CreateCollection;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.CreateCollection;

public sealed class CreateCollectionCommandValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_name()
    {
        CreateCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(new CreateCollectionCommand(" ", null));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CreateCollectionCommand.Name));
    }

    [Fact]
    public void Validate_rejects_too_long_description()
    {
        CreateCollectionCommandValidator validator = new();
        string description = new('x', DomainConstraints.Collections.DescriptionMaxLength + 1);

        FluentValidation.Results.ValidationResult result = validator.Validate(new CreateCollectionCommand("Mars", description));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(CreateCollectionCommand.Description));
    }
}
