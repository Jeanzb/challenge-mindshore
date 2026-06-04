using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Queries.GetCollections;
using NasaExplorer.Domain.Entities.Collections;

namespace NasaExplorer.Application.Tests.Features.Collections.Queries.GetCollections;

public sealed class GetCollectionsQueryHandlerTests
{
    [Fact]
    public async Task Handle_returns_current_user_collection_summaries()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        CollectionQueryTestData.CreateCollectionImage(collection, CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1"), 0);
        CollectionQueryTestData.CreateCollectionImage(collection, CollectionQueryTestData.CreateSpaceImage("mars-2", "Mars 2"), 1);
        FakeCollectionRepository repository = new([collection]);
        GetCollectionsQueryHandler handler = new(repository, new StubCurrentUserService(userId));

        IReadOnlyCollection<CollectionSummaryDto> result = await handler.Handle(new GetCollectionsQuery(), CancellationToken.None);
        CollectionSummaryDto summary = Assert.Single(result);

        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection.Id, summary.Id);
        Assert.Equal("Mars", summary.Name);
        Assert.Equal(2, summary.ImageCount);
    }
}
