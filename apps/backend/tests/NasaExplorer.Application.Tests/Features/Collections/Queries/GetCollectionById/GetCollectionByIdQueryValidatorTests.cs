using NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;

namespace NasaExplorer.Application.Tests.Features.Collections.Queries.GetCollectionById;

public sealed class GetCollectionByIdQueryValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_id()
    {
        GetCollectionByIdQueryValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(new GetCollectionByIdQuery(Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(GetCollectionByIdQuery.Id));
    }
}
