using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Tags.Commands.AddTagToImage;

public sealed class AddTagToImageCommandValidator : AbstractValidator<AddTagToImageCommand>
{
    public AddTagToImageCommandValidator()
    {
        RuleFor(command => command.CollectionImageId)
            .NotEmpty();

        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DomainConstraints.Tags.NameMaxLength);
    }
}
