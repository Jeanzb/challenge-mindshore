using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Features.Collections.Commands.RemoveImageFromCollection;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.RemoveImageFromCollection;

public sealed class RemoveImageFromCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_removes_current_user_collection_image()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage firstImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        SpaceImage secondImage = CollectionQueryTestData.CreateSpaceImage("mars-2", "Mars 2");
        CollectionImage removableImage = CollectionQueryTestData.CreateCollectionImage(collection, firstImage, 0);
        CollectionImage remainingImage = CollectionQueryTestData.CreateCollectionImage(collection, secondImage, 1);
        FakeCollectionRepository repository = new(collection);
        RemoveImageFromCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        await handler.Handle(new RemoveImageFromCollectionCommand(collection.Id, removableImage.Id), CancellationToken.None);

        CollectionImage result = Assert.Single(collection.Images);
        Assert.Equal(remainingImage.Id, result.Id);
        Assert.Equal(collection.Id, repository.LastRequestedCollectionId);
        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection, repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new((Collection?)null);
        RemoveImageFromCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new RemoveImageFromCollectionCommand(Guid.NewGuid(), Guid.NewGuid()), CancellationToken.None));

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
        RemoveImageFromCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new RemoveImageFromCollectionCommand(collection.Id, Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Collection image not found.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
        Assert.Single(collection.Images);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository repository = new(CollectionQueryTestData.CreateCollection(Guid.NewGuid(), "Mars"));
        RemoveImageFromCollectionCommandHandler handler = new(repository, new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(new RemoveImageFromCollectionCommand(Guid.NewGuid(), Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(repository.LastRequestedCollectionId);
        Assert.Null(repository.UpdatedCollection);
    }
}
