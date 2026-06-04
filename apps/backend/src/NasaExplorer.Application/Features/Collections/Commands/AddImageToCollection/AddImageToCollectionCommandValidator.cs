using FluentValidation;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Features.Collections.Commands.AddImageToCollection;

public sealed class AddImageToCollectionCommandValidator : AbstractValidator<AddImageToCollectionCommand>
{
    public AddImageToCollectionCommandValidator()
    {
        RuleFor(command => command.CollectionId)
            .NotEmpty();

        RuleFor(command => command.NasaImageId)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.NasaIdMaxLength);

        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.TitleMaxLength);

        RuleFor(command => command.Description)
            .MaximumLength(DomainConstraints.SpaceImages.DescriptionMaxLength);

        RuleFor(command => command.ImageUrl)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);

        RuleFor(command => command.ThumbnailUrl)
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);

        RuleFor(command => command.SourceUrl)
            .MaximumLength(DomainConstraints.SpaceImages.UrlMaxLength);

        RuleFor(command => command.MediaType)
            .NotEmpty()
            .MaximumLength(DomainConstraints.SpaceImages.MediaTypeMaxLength);

        RuleFor(command => command.Center)
            .MaximumLength(DomainConstraints.SpaceImages.CenterMaxLength);

        RuleFor(command => command.Mission)
            .MaximumLength(DomainConstraints.SpaceImages.MissionMaxLength);

        RuleFor(command => command.Rover)
            .MaximumLength(DomainConstraints.SpaceImages.RoverMaxLength);

        RuleFor(command => command.Camera)
            .MaximumLength(DomainConstraints.SpaceImages.CameraMaxLength);

        RuleFor(command => command.Keywords)
            .MaximumLength(DomainConstraints.SpaceImages.KeywordsMaxLength);

        RuleFor(command => command.UserNote)
            .MaximumLength(DomainConstraints.CollectionImages.UserNoteMaxLength);
    }
}
