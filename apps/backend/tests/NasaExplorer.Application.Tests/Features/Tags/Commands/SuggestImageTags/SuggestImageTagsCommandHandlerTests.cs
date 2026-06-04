using NasaExplorer.Application.DTOs.Tags;
using NasaExplorer.Application.Features.Tags.Commands.SuggestImageTags;
using NasaExplorer.Application.Tests.Features.Ai.Commands.EnrichImage;
using NasaExplorer.Application.Tests.Features.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;

namespace NasaExplorer.Application.Tests.Features.Tags.Commands.SuggestImageTags;

public sealed class SuggestImageTagsCommandHandlerTests
{
    [Fact]
    public async Task Handle_returns_ai_suggestions_for_collection_image()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage spaceImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage collectionImage = CollectionQueryTestData.CreateCollectionImage(collection, spaceImage, 0);
        StubAiEnrichmentService aiService = new(tags: ["mars", "rover"]);
        SuggestImageTagsCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            aiService,
            new StubCurrentUserService(userId));

        TagSuggestionsDto result = await handler.Handle(new SuggestImageTagsCommand(collectionImage.Id), CancellationToken.None);

        Assert.Equal(["mars", "rover"], result.Tags);
        Assert.Equal(1, aiService.SuggestTagsCalls);
    }
}
