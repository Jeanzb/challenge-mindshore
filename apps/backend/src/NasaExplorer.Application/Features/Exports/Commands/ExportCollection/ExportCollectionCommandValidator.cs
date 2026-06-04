using FluentValidation;

namespace NasaExplorer.Application.Features.Exports.Commands.ExportCollection;

public sealed class ExportCollectionCommandValidator : AbstractValidator<ExportCollectionCommand>
{
    public ExportCollectionCommandValidator()
    {
        RuleFor(command => command.CollectionId)
            .NotEmpty();

        RuleFor(command => command.Format)
            .NotEmpty()
            .Must(format => string.Equals(format, "PDF", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Only PDF export is supported.");
    }
}
