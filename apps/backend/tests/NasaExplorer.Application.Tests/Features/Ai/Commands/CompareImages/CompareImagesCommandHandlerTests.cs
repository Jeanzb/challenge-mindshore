using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Ai;
using NasaExplorer.Application.Features.Ai.Commands.CompareImages;
using NasaExplorer.Application.Tests.Features.Ai.Commands.EnrichImage;
using NasaExplorer.Application.Tests.Features.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Tests.Features.Ai.Commands.CompareImages;

public sealed class CompareImagesCommandHandlerTests
{
    [Fact]
    public async Task Handle_creates_comparison_for_current_user_collection_images()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage firstImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        SpaceImage secondImage = CollectionQueryTestData.CreateSpaceImage("mars-2", "Mars 2");
        CollectionImage firstCollectionImage = CollectionQueryTestData.CreateCollectionImage(collection, firstImage, 0);
        CollectionImage secondCollectionImage = CollectionQueryTestData.CreateCollectionImage(collection, secondImage, 1);
        FakeImageComparisonRepository comparisonRepository = new();
        StubAiEnrichmentService aiService = new(comparisonResult: "The images show changing Martian terrain.");
        CompareImagesCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            comparisonRepository,
            aiService,
            new StubCurrentUserService(userId));

        ComparisonResultDto result = await handler.Handle(
            new CompareImagesCommand([firstCollectionImage.Id, secondCollectionImage.Id], "Mars comparison", "es"),
            CancellationToken.None);

        Assert.NotNull(comparisonRepository.AddedComparison);
        Assert.Equal(userId, comparisonRepository.AddedComparison.UserId);
        Assert.Equal("Mars comparison", result.Title);
        Assert.Equal("The images show changing Martian terrain.", result.Analysis);
        Assert.Equal([firstCollectionImage.Id, secondCollectionImage.Id], result.ImageIds);
        Assert.Equal(1, aiService.CompareCalls);
        Assert.Equal("es", aiService.LastComparisonLanguage);
    }

    [Fact]
    public async Task Handle_throws_not_found_when_any_image_is_outside_current_user_scope()
    {
        Guid userId = Guid.NewGuid();
        Collection collection = CollectionQueryTestData.CreateCollection(userId, "Mars");
        SpaceImage firstImage = CollectionQueryTestData.CreateSpaceImage("mars-1", "Mars 1");
        CollectionImage firstCollectionImage = CollectionQueryTestData.CreateCollectionImage(collection, firstImage, 0);
        CompareImagesCommandHandler handler = new(
            new FakeCollectionRepository(collection),
            new FakeImageComparisonRepository(),
            new StubAiEnrichmentService(),
            new StubCurrentUserService(userId));

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new CompareImagesCommand([firstCollectionImage.Id, Guid.NewGuid()], null), CancellationToken.None));

        Assert.Equal("One or more collection images were not found.", exception.Message);
    }
}

internal sealed class FakeImageComparisonRepository : IImageComparisonRepository
{
    public ImageComparison? AddedComparison { get; private set; }

    public Task AddAsync(ImageComparison comparison, CancellationToken cancellationToken = default)
    {
        AddedComparison = comparison;

        return Task.CompletedTask;
    }
}
