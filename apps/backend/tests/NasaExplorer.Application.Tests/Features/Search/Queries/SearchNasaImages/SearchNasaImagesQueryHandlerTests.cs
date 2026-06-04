using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Application.Features.Search.Queries.SearchNasaImages;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Application.Tests.Features.Search.Queries.SearchNasaImages;

public sealed class SearchNasaImagesQueryHandlerTests
{
    [Fact]
    public async Task Handle_returns_frontend_ready_normalized_images()
    {
        StubNasaApiService nasaApiService = new(new NasaSearchResult(
            [
                new NasaImageAsset(
                    "mars-1",
                    "Mars Terrain",
                    "Curiosity Mastcam terrain",
                    "JPL",
                    "image",
                    "https://images.test/mars-thumb.jpg",
                    "https://images.test/mars-large.jpg",
                    "https://images.nasa.gov/details/mars-1",
                    new DateTimeOffset(2024, 5, 17, 0, 0, 0, TimeSpan.Zero),
                    ["Mars", "Curiosity", "Mastcam"],
                    null,
                    "Curiosity",
                    "Mastcam",
                    "https://images.test/mars-small.jpg",
                    "https://images.test/mars-medium.jpg",
                    "https://images.test/mars-orig.jpg")
            ],
            1,
            1,
            24));
        SearchNasaImagesQueryHandler handler = new(nasaApiService);

        NasaSearchResultDto result = await handler.Handle(
            new SearchNasaImagesQuery("mars", null, null, null, null, null, 1, 24),
            CancellationToken.None);

        NasaImageDto image = Assert.Single(result.Images);

        Assert.Equal("mars-1", image.NasaImageId);
        Assert.Equal("Curiosity", image.Rover);
        Assert.Equal("Mastcam", image.Camera);
        Assert.Equal("2024-05-17", image.DisplayDate);
        Assert.Equal("https://images.test/mars-small.jpg", image.Urls.Card);
        Assert.Equal("https://images.test/mars-medium.jpg", image.Urls.Preview);
        Assert.Equal("https://images.test/mars-orig.jpg", image.Urls.Full);
        Assert.NotNull(image.Timeline);
        Assert.Equal(2024, image.Timeline.Year);
        Assert.Equal(5, image.Timeline.Month);
        Assert.Equal(17, image.Timeline.Day);
    }

    private sealed class StubNasaApiService : INasaApiService
    {
        private readonly NasaSearchResult _searchResult;

        public StubNasaApiService(NasaSearchResult searchResult)
        {
            _searchResult = searchResult;
        }

        public Task<NasaSearchResult> SearchImagesAsync(
            NasaSearchCriteria criteria,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_searchResult);
        }

        public Task<IReadOnlyCollection<NasaAssetFile>> GetAssetFilesAsync(
            string nasaImageId,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IReadOnlyCollection<NasaAssetFile>>([]);
        }
    }
}
