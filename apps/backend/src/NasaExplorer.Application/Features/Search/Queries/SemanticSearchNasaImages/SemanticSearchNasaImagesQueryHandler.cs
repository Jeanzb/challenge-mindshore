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
        string originalQuery = request.Query ?? string.Empty;
        string optimizedQuery = await _aiEnrichmentService.CreateSemanticSearchAsync(originalQuery, cancellationToken);
        IReadOnlyCollection<string> candidateQueries = SemanticSearchQueryNormalizer.BuildCandidateQueries(originalQuery, optimizedQuery);
        NasaSearchResult result = new([], 0, request.Page, request.PageSize);

        foreach (string candidateQuery in candidateQueries.DefaultIfEmpty(string.Empty))
        {
            result = await _nasaApiService.SearchImagesAsync(
                new NasaSearchCriteria(
                    candidateQuery,
                    request.DateFrom,
                    request.DateTo,
                    request.Rover,
                    request.Camera,
                    request.Mission,
                    request.Page,
                    request.PageSize),
                cancellationToken);

            if (result.Images.Count > 0)
            {
                break;
            }
        }

        return NasaSearchResultMapper.ToDto(result);
    }
}
