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

    [Fact]
    public async Task Handle_translates_spanish_space_terms_before_searching_nasa()
    {
        StubAiEnrichmentService aiService = new(semanticSearchResult: "telescopio espacial");
        StubNasaApiService nasaApiService = new(new NasaSearchResult([], 0, 1, 24));
        SemanticSearchNasaImagesQueryHandler handler = new(nasaApiService, aiService);

        await handler.Handle(
            new SemanticSearchNasaImagesQuery(
                "telescopio espacial",
                null,
                null,
                null,
                null,
                null,
                1,
                24),
            CancellationToken.None);

        Assert.Contains(nasaApiService.CriteriaCalls, criteria => criteria.Query == "telescope space");
    }

    [Fact]
    public async Task Handle_normalizes_spanish_rover_camera_and_crater_query_without_ai_translation()
    {
        StubAiEnrichmentService aiService = new(semanticSearchResult: "Mostrame cráteres de Marte capturados por Curiosity con Navcam");
        StubNasaApiService nasaApiService = new(new NasaSearchResult([], 0, 1, 24));
        SemanticSearchNasaImagesQueryHandler handler = new(nasaApiService, aiService);

        await handler.Handle(
            new SemanticSearchNasaImagesQuery(
                "Mostrame cráteres de Marte capturados por Curiosity con Navcam",
                null,
                null,
                null,
                null,
                null,
                1,
                24),
            CancellationToken.None);

        Assert.Contains(nasaApiService.CriteriaCalls, criteria => criteria.Query == "craters mars curiosity navcam");
    }

    [Fact]
    public async Task Handle_retries_with_semantic_tags_when_first_nasa_query_is_empty()
    {
        StubAiEnrichmentService aiService = new(semanticSearchResult: "atardecer");
        StubNasaApiService nasaApiService = new(
            new Dictionary<string, NasaSearchResult>(StringComparer.OrdinalIgnoreCase)
            {
                ["sunset"] = new NasaSearchResult(
                    [
                        new NasaImageAsset(
                            "sunset-1",
                            "Mars Sunset",
                            "A sunset seen from Mars.",
                            "JPL",
                            "image",
                            "https://images.test/sunset-thumb.jpg",
                            "https://images.test/sunset.jpg",
                            "https://images.nasa.gov/details/sunset-1",
                            DateTimeOffset.UtcNow,
                            ["sunset", "mars"])
                    ],
                    1,
                    1,
                    24)
            });
        SemanticSearchNasaImagesQueryHandler handler = new(nasaApiService, aiService);

        NasaSearchResultDto result = await handler.Handle(
            new SemanticSearchNasaImagesQuery(
                "atardecer",
                null,
                null,
                null,
                null,
                null,
                1,
                24),
            CancellationToken.None);

        Assert.Contains(nasaApiService.CriteriaCalls, criteria => criteria.Query == "sunset");
        Assert.Equal("sunset-1", Assert.Single(result.Images).NasaImageId);
    }
}

internal sealed class StubNasaApiService : INasaApiService
{
    private readonly NasaSearchResult _searchResult;
    private readonly IReadOnlyDictionary<string, NasaSearchResult>? _searchResultsByQuery;

    public StubNasaApiService(NasaSearchResult searchResult)
    {
        _searchResult = searchResult;
    }

    public StubNasaApiService(IReadOnlyDictionary<string, NasaSearchResult> searchResultsByQuery)
    {
        _searchResult = new NasaSearchResult([], 0, 1, 24);
        _searchResultsByQuery = searchResultsByQuery;
    }

    public NasaSearchCriteria? LastCriteria { get; private set; }

    public List<NasaSearchCriteria> CriteriaCalls { get; } = [];

    public Task<NasaSearchResult> SearchImagesAsync(NasaSearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        LastCriteria = criteria;
        CriteriaCalls.Add(criteria);

        return Task.FromResult(
            _searchResultsByQuery is not null && _searchResultsByQuery.TryGetValue(criteria.Query, out NasaSearchResult? result)
                ? result
                : _searchResult);
    }

    public Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(
        string nasaImageId,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IReadOnlyCollection<NasaAssetFile>>([]);
    }
}
