using MediatR;
using NasaExplorer.Application.DTOs.Search;
using NasaExplorer.Application.Features.Search;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Nasa;

namespace NasaExplorer.Application.Features.Search.Queries.SemanticSearchNasaImages;

public sealed class SemanticSearchNasaImagesQueryHandler : IRequestHandler<SemanticSearchNasaImagesQuery, NasaSearchResultDto>
{
    private readonly INasaApiService _nasaApiService;
    private readonly IAiEnrichmentService _aiEnrichmentService;

    public SemanticSearchNasaImagesQueryHandler(INasaApiService nasaApiService, IAiEnrichmentService aiEnrichmentService)
    {
        _nasaApiService = nasaApiService;
        _aiEnrichmentService = aiEnrichmentService;
    }

    public async Task<NasaSearchResultDto> Handle(SemanticSearchNasaImagesQuery request, CancellationToken cancellationToken)
    {
        string optimizedQuery = await _aiEnrichmentService.CreateSemanticSearchAsync(request.Query ?? string.Empty, cancellationToken);
        string normalizedQuery = SemanticSearchQueryNormalizer.Normalize(optimizedQuery);
        NasaSearchResult result = await _nasaApiService.SearchImagesAsync(
            new NasaSearchCriteria(
                normalizedQuery,
                request.DateFrom,
                request.DateTo,
                request.Rover,
                request.Camera,
                request.Mission,
                request.Page,
                request.PageSize),
            cancellationToken);

        return NasaSearchResultMapper.ToDto(result);
    }
}
