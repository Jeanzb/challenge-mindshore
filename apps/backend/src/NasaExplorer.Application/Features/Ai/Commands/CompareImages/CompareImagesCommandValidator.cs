using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Ai.Commands.CompareImages;

public sealed class CompareImagesCommandValidator : AbstractValidator<CompareImagesCommand>
{
    public CompareImagesCommandValidator()
    {
        RuleFor(command => command.ImageIds)
            .NotNull()
            .Must(imageIds => imageIds.Count >= DomainConstraints.ImageComparisons.MinimumImageCount)
            .WithMessage("At least two images are required.");

        RuleFor(command => command.ImageIds)
            .Must(imageIds => imageIds.Distinct().Count() == imageIds.Count)
            .WithMessage("Duplicate images are not allowed.")
            .When(command => command.ImageIds is not null);

        RuleFor(command => command.Title)
            .MaximumLength(DomainConstraints.ImageComparisons.TitleMaxLength);
    }
}
