using FluentValidation;

namespace NasaExplorer.Application.Features.Collections.Commands.DeleteCollection;

public sealed class DeleteCollectionCommandValidator : AbstractValidator<DeleteCollectionCommand>
{
    public DeleteCollectionCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();
    }
}
