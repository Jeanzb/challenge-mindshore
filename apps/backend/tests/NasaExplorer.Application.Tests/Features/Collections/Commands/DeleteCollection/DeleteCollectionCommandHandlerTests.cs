using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Features.Collections.Commands.DeleteCollection;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.DeleteCollection;

public sealed class DeleteCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_soft_deletes_current_user_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        FakeCollectionRepository repository = new(collection);
        DeleteCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        await handler.Handle(new DeleteCollectionCommand(collection.Id), CancellationToken.None);

        Assert.Equal(collection.Id, repository.LastRequestedCollectionId);
        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection, repository.UpdatedCollection);
        Assert.True(collection.IsDeleted);
        Assert.NotNull(collection.DeletedAt);
        Assert.Equal(collection.DeletedAt, collection.UpdatedAt);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new((Collection?)null);
        DeleteCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new DeleteCollectionCommand(Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Collection not found.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository repository = new(CollectionQueryTestData.CreateCollection(Guid.NewGuid(), "Mars"));
        DeleteCollectionCommandHandler handler = new(repository, new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(new DeleteCollectionCommand(Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }
}
