using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Tags.Commands.AddTagToImage;
using NasaExplorer.Application.Tests.Features.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Tags.Commands.AddTagToImage;

public sealed class AddTagToImageCommandHandlerTests
{
    [Fact]
    public async Task Handle_creates_user_tag_and_applies_it_to_collection_image()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        FakeTagRepository tagRepository = new();
        AddTagToImageCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            tagRepository,
            new StubCurrentUserService(userId));

        ImageTagDto result = await handler.Handle(
            new AddTagToImageCommand(collectionImage.Id, " Mars ", false),
            CancellationToken.None);

        Assert.NotNull(tagRepository.AddedTag);
        Assert.Equal(userId, tagRepository.AddedTag.UserId);
        Assert.Equal("Mars", tagRepository.AddedTag.Name);
        Assert.Equal("mars", tagRepository.AddedTag.NormalizedName);
        Assert.NotNull(tagRepository.AddedImageTag);
        Assert.Equal(spaceImage.Id, tagRepository.AddedImageTag.SpaceImageId);
        Assert.Equal(tagRepository.AddedTag.Id, result.Id);
        Assert.Equal("Mars", result.Name);
    }

    [Fact]
    public async Task Handle_reuses_existing_normalized_user_tag()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        Tag existingTag = Tag.Create(userId, "mars", false, DateTimeOffset.UtcNow);
        FakeTagRepository tagRepository = new(existingTag);
        AddTagToImageCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            tagRepository,
            new StubCurrentUserService(userId));

        ImageTagDto result = await handler.Handle(
            new AddTagToImageCommand(collectionImage.Id, " MARS ", true),
            CancellationToken.None);

        Assert.Null(tagRepository.AddedTag);
        Assert.NotNull(tagRepository.AddedImageTag);
        Assert.Equal(existingTag.Id, tagRepository.AddedImageTag.TagId);
        Assert.Equal(existingTag.Id, result.Id);
        Assert.False(result.IsAiGenerated);
    }
}
