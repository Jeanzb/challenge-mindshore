using FluentValidation;

namespace NasaExplorer.Application.Features.Collections.Commands.RemoveImageFromCollection;

public sealed class RemoveImageFromCollectionCommandValidator : AbstractValidator<RemoveImageFromCollectionCommand>
{
    public RemoveImageFromCollectionCommandValidator()
    {
        RuleFor(command => command.CollectionId)
            .NotEmpty();

        RuleFor(command => command.ImageId)
            .NotEmpty();
    }
}
