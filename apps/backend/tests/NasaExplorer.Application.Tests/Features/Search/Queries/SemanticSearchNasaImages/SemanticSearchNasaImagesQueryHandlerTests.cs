using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Application.Features.Search.Queries.SemanticSearchNasaImages;
using NasaExplorer.Application.Tests.Features.Ai.Commands.EnrichImage;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Application.Tests.Features.Search.Queries.SemanticSearchNasaImages;

public sealed class SemanticSearchNasaImagesQueryHandlerTests
{
    [Fact]
    public async Task Handle_uses_ai_query_to_search_nasa()
    {
        StubAiEnrichmentService aiService = new(semanticSearchResult: "mars rover dust storm");
        StubNasaApiService nasaApiService = new(new NasaSearchResult(
            [
                new NasaImageAsset(
                    "mars-1",
                    "Mars Dust",
                    "Dust storm",
                    "JPL",
                    "image",
                    "https://images.test/mars-thumb.jpg",
                    "https://images.test/mars.jpg",
                    "https://images.nasa.gov/details/mars-1",
                    DateTimeOffset.UtcNow,
                    ["mars"])
            ],
            1,
            2,
            12));
        SemanticSearchNasaImagesQueryHandler handler = new(nasaApiService, aiService);

        NasaSearchResultDto result = await handler.Handle(
            new SemanticSearchNasaImagesQuery(
                "show me red planet storms",
                DateOnly.FromDateTime(new DateTime(2024, 1, 1)),
                null,
                "Perseverance",
                "Mastcam",
                "Mars",
                2,
                12),
            CancellationToken.None);

        Assert.Equal("mars rover dust storm", nasaApiService.LastCriteria?.Query);
        Assert.Equal("Perseverance", nasaApiService.LastCriteria?.Rover);
        Assert.Equal(1, aiService.SemanticSearchCalls);
        Assert.Equal(1, result.TotalHits);
        Assert.Equal("mars-1", Assert.Single(result.Images).NasaImageId);
    }
}

internal sealed class StubNasaApiService : INasaApiService
{
    private readonly NasaSearchResult _searchResult;

    public StubNasaApiService(NasaSearchResult searchResult)
    {
        _searchResult = searchResult;
    }

    public NasaSearchCriteria? LastCriteria { get; private set; }

    public Task<NasaSearchResult> SearchImagesAsync(NasaSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        LastCriteria = criteria;

        return Task.FromResult(_searchResult);
    }

    public Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(
        string nasaImageId,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IReadOnlyCollection<NasaAssetFile>>([]);
    }
}
