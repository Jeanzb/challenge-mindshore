using FluentValidation;

namespace NasaExplorer.Application.Features.Tags.Commands.RemoveTagFromImage;

public sealed class RemoveTagFromImageCommandValidator : AbstractValidator<RemoveTagFromImageCommand>
{
    public RemoveTagFromImageCommandValidator()
    {
        RuleFor(command => command.CollectionImageId)
            .NotEmpty();

        RuleFor(command => command.TagId)
            .NotEmpty();
    }
}
