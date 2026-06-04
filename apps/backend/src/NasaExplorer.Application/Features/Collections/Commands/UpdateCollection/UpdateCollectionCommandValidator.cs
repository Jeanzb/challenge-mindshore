using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollection;

public sealed class UpdateCollectionCommandValidator : AbstractValidator<UpdateCollectionCommand>
{
    public UpdateCollectionCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty();

        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DomainConstraints.Collections.NameMaxLength);

        RuleFor(command => command.Description)
            .MaximumLength(DomainConstraints.Collections.DescriptionMaxLength);
    }
}
