using NasaExplorer.Application.Features.Collections.Commands.UpdateCollectionImageNote;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.UpdateCollectionImageNote;

public sealed class UpdateCollectionImageNoteCommandValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_collection_id()
    {
        UpdateCollectionImageNoteCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new UpdateCollectionImageNoteCommand(Guid.Empty, Guid.NewGuid(), "note"));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionImageNoteCommand.CollectionId));
    }

    [Fact]
    public void Validate_rejects_empty_image_id()
    {
        UpdateCollectionImageNoteCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new UpdateCollectionImageNoteCommand(Guid.NewGuid(), Guid.Empty, "note"));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionImageNoteCommand.ImageId));
    }

    [Fact]
    public void Validate_rejects_too_long_user_note()
    {
        UpdateCollectionImageNoteCommandValidator validator = new();
        string userNote = new('x', DomainConstraints.CollectionImages.UserNoteMaxLength + 1);

        FluentValidation.Results.ValidationResult result = validator.Validate(
            new UpdateCollectionImageNoteCommand(Guid.NewGuid(), Guid.NewGuid(), userNote));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(UpdateCollectionImageNoteCommand.UserNote));
    }
}
