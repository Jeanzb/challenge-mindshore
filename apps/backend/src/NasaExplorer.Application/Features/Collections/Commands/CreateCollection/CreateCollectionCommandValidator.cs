using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Collections.Commands.CreateCollection;

public sealed class CreateCollectionCommandValidator : AbstractValidator<CreateCollectionCommand>
{
    public CreateCollectionCommandValidator()
    {
        RuleFor(command => command.Name)
            .NotEmpty()
            .MaximumLength(DomainConstraints.Collections.NameMaxLength);

        RuleFor(command => command.Description)
            .MaximumLength(DomainConstraints.Collections.DescriptionMaxLength);
    }
}
