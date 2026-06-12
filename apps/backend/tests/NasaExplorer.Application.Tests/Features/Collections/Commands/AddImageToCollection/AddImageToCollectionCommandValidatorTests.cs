using NasaExplorer.Application.Features.Collections.Commands.AddImageToCollection;
using NasaExplorer.Domain.Constants;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.AddImageToCollection;

public sealed class AddImageToCollectionCommandValidatorTests
{
    [Fact]
    public void Validate_rejects_empty_collection_id()
    {
        AddImageToCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(CreateCommand(collectionId: Guid.Empty));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.CollectionId));
    }

    [Fact]
    public void Validate_rejects_required_image_fields()
    {
        AddImageToCollectionCommandValidator validator = new();

        FluentValidation.Results.ValidationResult result = validator.Validate(CreateCommand(
            nasaImageId: " ",
            title: " ",
            imageUrl: " ",
            mediaType: " "));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.NasaImageId));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.Title));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.ImageUrl));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.MediaType));
    }

    [Fact]
    public void Validate_rejects_too_long_user_note()
    {
        AddImageToCollectionCommandValidator validator = new();
        string userNote = new('x', DomainConstraints.CollectionImages.UserNoteMaxLength + 1);

        FluentValidation.Results.ValidationResult result = validator.Validate(CreateCommand(userNote: userNote));

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(AddImageToCollectionCommand.UserNote));
    }

    private static AddImageToCollectionCommand CreateCommand(
        Guid? collectionId = null,
        string nasaImageId = "mars-1",
        string title = "Mars 1",
        string imageUrl = "https://images.test/mars-1.jpg",
        string mediaType = "image",
        string? userNote = "Personal note")
    {
        return new AddImageToCollectionCommand(
            collectionId ?? Guid.NewGuid(),
            nasaImageId,
            title,
            "NASA description",
            imageUrl,
            "https://images.test/mars-1-thumb.jpg",
            "https://images.nasa.gov/details/mars-1",
            mediaType,
            "JPL",
            "Mars",
            "Perseverance",
            "Mastcam",
            DateTimeOffset.UtcNow,
            "mars, rover",
            userNote);
    }
}
