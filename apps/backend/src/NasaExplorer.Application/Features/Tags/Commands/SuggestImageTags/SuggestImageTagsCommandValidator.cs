using FluentValidation;

namespace NasaExplorer.Application.Features.Tags.Commands.SuggestImageTags;

public sealed class SuggestImageTagsCommandValidator : AbstractValidator<SuggestImageTagsCommand>
{
    public SuggestImageTagsCommandValidator()
    {
        RuleFor(command => command.CollectionImageId)
            .NotEmpty();
    }
}
