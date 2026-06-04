using FluentValidation;

namespace NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;

public sealed class GetCollectionByIdQueryValidator : AbstractValidator<GetCollectionByIdQuery>
{
    public GetCollectionByIdQueryValidator()
    {
        RuleFor(query => query.Id)
            .NotEmpty();
    }
}
