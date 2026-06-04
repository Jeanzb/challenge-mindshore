using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Features.Tags.Commands.RemoveTagFromImage;
using NasaExplorer.Application.Tests.Features.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using System.Reflection;

namespace NasaExplorer.Application.Tests.Features.Tags.Commands.RemoveTagFromImage;

public sealed class RemoveTagFromImageCommandHandlerTests
{
    [Fact]
    public async Task Handle_removes_existing_user_tag_from_collection_image()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        Tag tag = Tag.Create(userId, "mars", false, DateTimeOffset.UtcNow);
        ImageTag imageTag = ImageTag.Create(spaceImage.Id, tag.Id, DateTimeOffset.UtcNow);
        typeof(ImageTag)
            .GetProperty(nameof(ImageTag.Tag), BindingFlags.Instance | BindingFlags.Public)!
            .SetValue(imageTag, tag);
        FakeTagRepository tagRepository = new(tag, imageTag);
        RemoveTagFromImageCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            tagRepository,
            new StubCurrentUserService(userId));

        await handler.Handle(new RemoveTagFromImageCommand(collectionImage.Id, tag.Id), CancellationToken.None);

        Assert.Equal(imageTag, tagRepository.RemovedImageTag);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_image_is_outside_user_scope()
    {
        Guid userId = Guid.NewGuid();
        RemoveTagFromImageCommandHandler handler = new(
            new FakeCollectionRepository(CollectionQueryTestData.CreateCollection(userId, "Mars")),
            new FakeTagRepository(),
            new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new RemoveTagFromImageCommand(Guid.NewGuid(), Guid.NewGuid()), CancellationToken.None));

        Assert.Equal("Collection image not found.", exception.Message);
    }
}
