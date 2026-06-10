using FluentValidation;

namespace NasaExplorer.Application.Features.Search.Queries.SearchNasaImages;

public sealed class SearchNasaImagesQueryValidator : AbstractValidator<SearchNasaImagesQuery>
{
    public SearchNasaImagesQueryValidator()
    {
        RuleFor(query => query.Query)
            .MaximumLength(160);

        RuleFor(query => query.Rover)
            .MaximumLength(120);

        RuleFor(query => query.Camera)
            .MaximumLength(120);

        RuleFor(query => query.Mission)
            .MaximumLength(120);

        RuleFor(query => query.Page)
            .InclusiveBetween(1, 1_000);

        RuleFor(query => query.PageSize)
            .InclusiveBetween(1, 100);

        RuleFor(query => query.DateTo)
            .GreaterThanOrEqualTo(query => query.DateFrom)
            .When(query => query.DateFrom.HasValue && query.DateTo.HasValue);
    }
}
