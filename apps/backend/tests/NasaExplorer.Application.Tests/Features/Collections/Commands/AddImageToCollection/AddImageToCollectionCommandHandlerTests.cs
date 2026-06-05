using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Commands.AddImageToCollection;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.AddImageToCollection;

public sealed class AddImageToCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_adds_existing_space_image_to_current_user_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        FakeCollectionRepository collectionRepository = new(collection);
        FakeSpaceImageRepository spaceImageRepository = new(spaceImage);
        AddImageToCollectionCommandHandler handler = new(
            collectionRepository,
            spaceImageRepository,
            new StubCurrentUserService(userId));

        CollectionImageDto result = await handler.Handle(CreateCommand(collection.Id), CancellationToken.None);

        CollectionImage collectionImage = Assert.Single(collection.Images);
        Assert.Equal(collection.Id, collectionRepository.LastRequestedCollectionId);
        Assert.Equal(userId, collectionRepository.LastRequestedUserId);
        Assert.Equal("mars-1", spaceImageRepository.LastRequestedNasaId);
        Assert.Null(spaceImageRepository.AddedImage);
        Assert.Equal(collectionImage, collectionRepository.AddedCollectionImage);
        Assert.Null(collectionRepository.UpdatedCollection);
        Assert.Equal(spaceImage.Id, collectionImage.SpaceImageId);
        Assert.Equal("Personal note", collectionImage.UserNote);
        Assert.Equal(0, collectionImage.SortOrder);
        Assert.Equal(collectionImage.Id, result.Id);
        Assert.Equal(spaceImage.Id, result.SpaceImageId);
        Assert.Equal("Mars 1", result.Title);
    }

    [Fact]
    public async Task Handle_persists_missing_space_image_before_adding_to_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        FakeCollectionRepository collectionRepository = new(collection);
        FakeSpaceImageRepository spaceImageRepository = new(null);
        AddImageToCollectionCommandHandler handler = new(
            collectionRepository,
            spaceImageRepository,
            new StubCurrentUserService(userId));

        CollectionImageDto result = await handler.Handle(CreateCommand(collection.Id), CancellationToken.None);

        CollectionImage collectionImage = Assert.Single(collection.Images);
        Assert.NotNull(spaceImageRepository.AddedImage);
        Assert.Equal("mars-1", spaceImageRepository.AddedImage.NasaId);
        Assert.Equal("Mars 1", spaceImageRepository.AddedImage.Title);
        Assert.Equal("JPL", spaceImageRepository.AddedImage.Center);
        Assert.Equal(collectionImage, collectionRepository.AddedCollectionImage);
        Assert.Equal(spaceImageRepository.AddedImage.Id, collectionImage.SpaceImageId);
        Assert.Equal(spaceImageRepository.AddedImage.Id, result.SpaceImageId);
        Assert.Equal("mars-1", result.NasaImageId);
    }

    [Fact]
    public async Task Handle_rejects_duplicate_space_image_in_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        FakeCollectionRepository collectionRepository = new(collection);
        FakeSpaceImageRepository spaceImageRepository = new(spaceImage);
        AddImageToCollectionCommandHandler handler = new(
            collectionRepository,
            spaceImageRepository,
            new StubCurrentUserService(userId));

        ValidationException exception = await Assert.ThrowsAsync<ValidationException>(() =>
            handler.Handle(CreateCommand(collection.Id), CancellationToken.None));

        Assert.Contains(nameof(AddImageToCollectionCommand.NasaImageId), exception.Errors.Keys);
        Assert.Null(collectionRepository.AddedCollectionImage);
        Assert.Null(collectionRepository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository collectionRepository = new((Collection?)null);
        FakeSpaceImageRepository spaceImageRepository = new(CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1"));
        AddImageToCollectionCommandHandler handler = new(
            collectionRepository,
            spaceImageRepository,
            new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(CreateCommand(Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Collection not found.", exception.Message);
        Assert.Null(spaceImageRepository.LastRequestedNasaId);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository collectionRepository = new(CollectionQueryTestData.CreateCollection(Guid.NewGuid(), "Mars"));
        FakeSpaceImageRepository spaceImageRepository = new(CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1"));
        AddImageToCollectionCommandHandler handler = new(
            collectionRepository,
            spaceImageRepository,
            new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(CreateCommand(Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(collectionRepository.LastRequestedCollectionId);
        Assert.Null(spaceImageRepository.LastRequestedNasaId);
    }

    private static AddImageToCollectionCommand CreateCommand(Guid collectionId)
    {
        return new AddImageToCollectionCommand(
            collectionId,
            "mars-1",
            "Mars 1",
            "NASA description",
            "https://images.test/mars-1.jpg",
            "https://images.test/mars-1-thumb.jpg",
            "https://images.nasa.gov/details/mars-1",
            "image",
            "JPL",
            "Mars",
            "Perseverance",
            "Mastcam",
            DateTimeOffset.UtcNow,
            "mars, rover",
            "Personal note");
    }
}
