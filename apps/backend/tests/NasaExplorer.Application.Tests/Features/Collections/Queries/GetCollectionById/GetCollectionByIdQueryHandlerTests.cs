using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Collections.Queries.GetCollectionById;

public sealed class GetCollectionByIdQueryHandlerTests
{
    [Fact]
    public async Task Handle_returns_current_user_collection_detail()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage secondImage = CollectionQueryTestData.CreateSpaceImage("mars-2", "Second Mars");
        SpaceImage firstImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "First Mars");
        CollectionQueryTestData.AddTag(firstImage, userId, "Rover", false);
        CollectionQueryTestData.AddTag(firstImage, userId, "AI", true);
        CollectionQueryTestData.CreateCollectionImage(collection, secondImage, 1);
        CollectionQueryTestData.CreateCollectionImage(collection, firstImage, 0);
        FakeCollectionRepository repository = new(collection);
        GetCollectionByIdQueryHandler handler = new(repository, new StubCurrentUserService(userId));

        CollectionDto result = await handler.Handle(new GetCollectionByIdQuery(collection.Id), CancellationToken.None);

        Assert.Equal(userId, repository.LastRequestedUserId);
        Assert.Equal(collection.Id, repository.LastRequestedCollectionId);
        Assert.Equal(collection.Id, result.Id);
        Assert.Collection(
            result.Images,
            image =>
            {
                Assert.Equal(firstImage.Id, image.SpaceImageId);
                Assert.Equal("First Mars", image.Title);
                Assert.Equal(0, image.SortOrder);
                Assert.Equal(["AI", "Rover"], image.Tags.Select(tag => tag.Name).ToArray());
            },
            image =>
            {
                Assert.Equal(secondImage.Id, image.SpaceImageId);
                Assert.Equal("Second Mars", image.Title);
                Assert.Equal(1, image.SortOrder);
                Assert.Empty(image.Tags);
            });
    }

    [Fact]
    public async Task Handle_throws_not_found_when_collection_is_missing()
    {
        Guid userId = Guid.NewGuid();
        FakeCollectionRepository repository = new((Collection?)null);
        GetCollectionByIdQueryHandler handler = new(repository, new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new GetCollectionByIdQuery(Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Collection not found.", exception.Message);
    }
}
