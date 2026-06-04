using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Ai.Commands.EnrichImage;

public sealed class EnrichImageCommandValidator : AbstractValidator<EnrichImageCommand>
{
    public EnrichImageCommandValidator()
    {
        RuleFor(command => command.NasaImageId)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.NasaIdMaxLength);

        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.TitleMaxLength);

        RuleFor(command => command.Description)
            .MaximumLength(DomainConstraints.SpaceImages.DescriptionMaxLength);

        RuleFor(command => command.ImageUrl)
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);

        RuleFor(command => command.ThumbnailUrl)
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);

        RuleFor(command => command.SourceUrl)
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);
    }
}
