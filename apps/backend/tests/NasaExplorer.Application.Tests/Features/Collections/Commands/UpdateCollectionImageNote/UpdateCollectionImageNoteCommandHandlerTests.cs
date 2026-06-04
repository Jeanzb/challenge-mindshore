using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Commands.UpdateCollectionImageNote;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.UpdateCollectionImageNote;

public sealed class UpdateCollectionImageNoteCommandHandlerTests
{
    [Fact]
    public async Task Handle_updates_current_user_collection_image_note()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionQueryTestData.AddTag(spaceImage, userId, "science", false);
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        FakeCollectionRepository repository = new(collection);
        UpdateCollectionImageNoteCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        CollectionImageDto result = await handler.Handle(
            new UpdateCollectionImageNoteCommand(collection.Id, collectionImage.Id, " Updated note "),
            CancellationToken.None);

        Assert.Equal(collection.Id, repository.LastRequestedCollectionId);
        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection, repository.UpdatedCollection);
        Assert.Equal("Updated note", collectionImage.UserNote);
        Assert.Equal(collectionImage.Id, result.Id);
        Assert.Equal(spaceImage.Id, result.SpaceImageId);
        Assert.Equal("Mars 1", result.Title);
        Assert.Equal("Updated note", result.UserNote);
        ImageTagDto tag = Assert.Single(result.Tags);
        Assert.Equal("science", tag.Name);
    }

    [Fact]
    public async Task Handle_clears_note_when_request_is_blank()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        FakeCollectionRepository repository = new(collection);
        UpdateCollectionImageNoteCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        CollectionImageDto result = await handler.Handle(
            new UpdateCollectionImageNoteCommand(collection.Id, collectionImage.Id, " "),
            CancellationToken.None);

        Assert.Null(collectionImage.UserNote);
        Assert.Null(result.UserNote);
        Assert.Equal(collection, repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new((Collection?)null);
        UpdateCollectionImageNoteCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new UpdateCollectionImageNoteCommand(Guid.NewGuid(), Guid.NewGuid(), "note"), CancellationToken.None));

        Assert.Equal("Collection not found.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_image_is_missing()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        CollectionQueryTestData.CreateCollectionImage(collection, CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1"), 0);
        FakeCollectionRepository repository = new(collection);
        UpdateCollectionImageNoteCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new UpdateCollectionImageNoteCommand(collection.Id, Guid.NewGuid(), "note"), CancellationToken.None));

        Assert.Equal("Collection image not found.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository repository = new(CollectionQueryTestData.CreateCollection(Guid.NewGuid(), "Mars"));
        UpdateCollectionImageNoteCommandHandler handler = new(repository, new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(new UpdateCollectionImageNoteCommand(Guid.NewGuid(), Guid.NewGuid(), "note"), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(repository.LastRequestedCollectionId);
        Assert.Null(repository.UpdatedCollection);
    }
}
