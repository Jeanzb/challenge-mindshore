using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Commands.CreateCollection;

namespace NasaExplorer.Application.Tests.Features.Collections.Commands.CreateCollection;

public sealed class CreateCollectionCommandHandlerTests
{
    [Fact]
    public async Task Handle_creates_collection_for_current_user()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new([]);
        CreateCollectionCommandHandler handler = new(repository, new StubCurrentUserService(userId));

        CollectionSummaryDto result = await handler.Handle(
            new CreateCollectionCommand(" Mars Missions ", " Red planet images "),
            CancellationToken.None);

        Assert.NotNull(repository.AddedCollection);
        Assert.Equal(userId, repository.AddedCollection.UserId);
        Assert.Equal("Mars Missions", repository.AddedCollection.Name);
        Assert.Equal("Red planet images", repository.AddedCollection.Description);
        Assert.Equal(repository.AddedCollection.Id, result.Id);
        Assert.Equal("Mars Missions", result.Name);
        Assert.Equal("Red planet images", result.Description);
        Assert.Equal(0, result.ImageCount);
    }

    [Fact]
    public async Task Handle_requires_authenticated_user()
    {
        FakeCollectionRepository repository = new([]);
        CreateCollectionCommandHandler handler = new(repository, new StubCurrentUserService(null));

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            handler.Handle(new CreateCollectionCommand("Mars", null), CancellationToken.None));

        Assert.Equal("Authenticated user id is required.", exception.Message);
        Assert.Null(repository.AddedCollection);
    }
}
