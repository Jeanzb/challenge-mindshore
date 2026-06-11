using NasaExplorer.Domain.Models.Nasa;
using NasaExplorer.Infrastructure.ExternalServices.NasaApi;
using System.Net;
using System.Text;

namespace NasaExplorer.Infrastructure.Tests.ExternalServices.NasaApi;

public sealed class NasaApiServiceTests
{
    [Fact]
    public async Task SearchImagesAsync_maps_collection_response_and_applies_date_filter()
    {
        StubHttpMessageHandler handler = new(SearchResponseJson);
        NasaApiService service = new(new HttpClient(handler)
        {
            BaseAddress = new Uri("https://images-api.nasa.gov/")
        });

        NasaSearchResult result = await service.SearchImagesAsync(new NasaSearchCriteria(
            "mars",
            new DateOnly(2019, 6, 1),
            new DateOnly(2019, 6, 1),
            "perseverance",
            "mastcam",
            null,
            2,
            2));

        NasaImageAsset image = Assert.Single(result.Images);

        Assert.Equal("NHQ201906010007", image.NasaImageId);
        Assert.Equal("Mars Celebration", image.Title);
        Assert.Equal("HQ", image.Center);
        Assert.Equal("image", image.MediaType);
        Assert.Equal("https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~large.jpg", image.ImageUrl);
        Assert.Equal("https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~thumb.jpg", image.ThumbnailUrl);
        Assert.Equal("https://images.nasa.gov/details/NHQ201906010007", image.SourceUrl);
        Assert.Equal("Curiosity", image.Rover);
        Assert.Equal("Mastcam", image.Camera);
        Assert.Equal("https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~small.jpg", image.CardUrl);
        Assert.Equal("https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~medium.jpg", image.PreviewUrl);
        Assert.Equal("https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~large.jpg", image.FullUrl);
        Assert.Equal(1, result.TotalHits);
        Assert.Equal(2, result.Page);
        Assert.Equal(2, result.PageSize);
        Assert.Contains("q=mars%20perseverance%20mastcam", handler.RequestUri!.Query);
        Assert.Contains("media_type=image", handler.RequestUri.Query);
        Assert.Contains("year_start=2019", handler.RequestUri.Query);
        Assert.Contains("year_end=2019", handler.RequestUri.Query);
        Assert.Contains("page=2", handler.RequestUri.Query);
        Assert.Contains("page_size=2", handler.RequestUri.Query);
    }

    [Fact]
    public async Task SearchImagesAsync_uses_nasa_total_hits_when_date_filter_is_not_applied()
    {
        StubHttpMessageHandler handler = new(SearchResponseJson);
        NasaApiService service = new(new HttpClient(handler)
        {
            BaseAddress = new Uri("https://images-api.nasa.gov/")
        });

        NasaSearchResult result = await service.SearchImagesAsync(new NasaSearchCriteria(
            "mars",
            null,
            null,
            null,
            null,
            null,
            1,
            2));

        Assert.Equal(2, result.Images.Count);
        Assert.Equal(26719, result.TotalHits);
    }

    [Fact]
    public async Task SearchImagesAsync_omits_query_parameter_for_general_image_search()
    {
        StubHttpMessageHandler handler = new(SearchResponseJson);
        NasaApiService service = new(new HttpClient(handler)
        {
            BaseAddress = new Uri("https://images-api.nasa.gov/")
        });

        await service.SearchImagesAsync(new NasaSearchCriteria(
            "",
            null,
            null,
            null,
            null,
            null,
            7,
            24));

        Assert.DoesNotContain("q=", handler.RequestUri!.Query);
        Assert.Contains("media_type=image", handler.RequestUri.Query);
        Assert.Contains("page=7", handler.RequestUri.Query);
        Assert.Contains("page_size=24", handler.RequestUri.Query);
    }

    [Fact]
    public async Task GetAssetFilesAsync_maps_asset_file_metadata()
    {
        StubHttpMessageHandler handler = new(AssetResponseJson);
        NasaApiService service = new(new HttpClient(handler)
        {
            BaseAddress = new Uri("https://images-api.nasa.gov/")
        });

        IReadOnlyCollection<NasaAssetFile> files = await service.GetAssetFilesAsync("NHQ201906010007");

        Assert.Equal("https://images-api.nasa.gov/asset/NHQ201906010007", handler.RequestUri!.ToString());
        Assert.Collection(
            files,
            file =>
            {
                Assert.Equal("canonical", file.Rel);
                Assert.Equal("image", file.Render);
            },
            file =>
            {
                Assert.Equal("alternate", file.Rel);
                Assert.Equal("image", file.Render);
            },
            file =>
            {
                Assert.Equal("metadata", file.Rel);
                Assert.Equal("metadata", file.Render);
            });
    }

    private const string SearchResponseJson = """
        {
          "collection": {
            "items": [
              {
                "data": [
                  {
                    "center": "HQ",
                    "date_created": "2019-06-01T00:00:00Z",
                    "description": "The Mars celebration captured by Curiosity Mastcam.",
                    "keywords": ["Mars", "Mars", "Celebration", "Curiosity", "Mastcam"],
                    "media_type": "image",
                    "nasa_id": "NHQ201906010007",
                    "title": "Mars Celebration"
                  }
                ],
                "links": [
                  {
                    "href": "https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~medium.jpg",
                    "rel": "alternate",
                    "render": "image"
                  },
                  {
                    "href": "https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~small.jpg",
                    "rel": "alternate",
                    "render": "image"
                  },
                  {
                    "href": "https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~thumb.jpg",
                    "rel": "preview",
                    "render": "image"
                  },
                  {
                    "href": "https://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~large.jpg",
                    "rel": "alternate",
                    "render": "image"
                  }
                ]
              },
              {
                "data": [
                  {
                    "center": "HQ",
                    "date_created": "2019-05-31T00:00:00Z",
                    "description": "Older Mars celebration.",
                    "keywords": ["Mars"],
                    "media_type": "image",
                    "nasa_id": "NHQ201905310033",
                    "title": "Mars Celebration"
                  }
                ],
                "links": [
                  {
                    "href": "https://images-assets.nasa.gov/image/NHQ201905310033/NHQ201905310033~large.jpg",
                    "rel": "alternate",
                    "render": "image"
                  }
                ]
              }
            ],
            "metadata": {
              "total_hits": 26719
            }
          }
        }
        """;

    private const string AssetResponseJson = """
        {
          "collection": {
            "items": [
              {
                "href": "http://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~orig.tif"
              },
              {
                "href": "http://images-assets.nasa.gov/image/NHQ201906010007/NHQ201906010007~large.jpg"
              },
              {
                "href": "http://images-assets.nasa.gov/image/NHQ201906010007/metadata.json"
              }
            ]
          }
        }
        """;

    private sealed class StubHttpMessageHandler : HttpMessageHandler
    {
        private readonly string _responseJson;

        public StubHttpMessageHandler(string responseJson)
        {
            _responseJson = responseJson;
        }

        public Uri? RequestUri { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            RequestUri = request.RequestUri;

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_responseJson, Encoding.UTF8, "application/json")
            });
        }
    }
}
