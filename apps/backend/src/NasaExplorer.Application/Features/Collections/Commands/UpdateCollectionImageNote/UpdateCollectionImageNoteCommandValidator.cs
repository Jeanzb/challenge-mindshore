using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollectionImageNote;

public sealed class UpdateCollectionImageNoteCommandValidator : AbstractValidator<UpdateCollectionImageNoteCommand>
{
    public UpdateCollectionImageNoteCommandValidator()
    {
        RuleFor(command => command.CollectionId)
            .NotEmpty();

        RuleFor(command => command.ImageId)
            .NotEmpty();

        RuleFor(command => command.UserNote)
            .MaximumLength(DomainConstraints.CollectionImages.UserNoteMaxLength);
    }
}
