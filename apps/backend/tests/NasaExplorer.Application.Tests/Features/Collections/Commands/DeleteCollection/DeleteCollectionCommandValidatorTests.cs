using NasaExplorer.Application.Features.Collections.Commands.DeleteCollection;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.DeleteCollection;

public sealed class DeleteCollectionCommandValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_id()
    {
        DeleteCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(new DeleteCollectionCommand(Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(DeleteCollectionCommand.Id));
    }
}
