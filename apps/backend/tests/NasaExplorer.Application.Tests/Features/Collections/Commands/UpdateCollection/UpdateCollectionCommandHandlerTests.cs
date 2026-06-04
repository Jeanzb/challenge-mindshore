using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Commands.UpdateCollection;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.UpdateCollection;

public sealed class UpdateCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_updates_current_user_collection()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        CollectionQueryTestData.CreateCollectionImage(collection, CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1"), 0);
        FakeCollectionRepository repository = new(collection);
        UpdateCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        CollectionSummaryDto result = await handler.Handle(
            new UpdateCollectionCommand(collection.Id, " Apollo ", " Moon missions "),
            CancellationToken.None);

        Assert.Equal(collection.Id, repository.LastRequestedCollectionId);
        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection, repository.UpdatedCollection);
        Assert.Equal("Apollo", collection.Name);
        Assert.Equal("Moon missions", collection.Description);
        Assert.Equal("Apollo", result.Name);
        Assert.Equal("Moon missions", result.Description);
        Assert.Equal(1, result.ImageCount);
        Assert.True(result.UpdatedAt >= result.CreatedAt);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new((Collection?)null);
        UpdateCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new UpdateCollectionCommand(Guid.NewGuid(), "Mars", null), CancellationToken.None));

        Assert.Equal("Collection not found.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository repository = new(CollectionQueryTestData.CreateCollection(Guid.NewGuid(), "Mars"));
        UpdateCollectionCommandHandler handler = new(repository, new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(new UpdateCollectionCommand(Guid.NewGuid(), "Mars", null), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(repository.UpdatedCollection);
    }
}
