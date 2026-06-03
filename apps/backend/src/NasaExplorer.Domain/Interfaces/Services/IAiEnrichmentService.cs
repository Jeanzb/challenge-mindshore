using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Models.Ai;

namespace NasaExplorer.Domain.Interfaces.Services;

public interface IAiEnrichmentService
{
    Task<AiImageEnrichmentResult> EnrichImageAsync(string imageTitle, string? imageDescription, CancellationToken cancellationToken = default);

    Task<string> CompareImagesAsync(IReadOnlyCollection<CollectionImage> images, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<string>> SuggestTagsAsync(string imageTitle, string? imageDescription, CancellationToken cancellationToken = default);

    Task<string> CreateSemanticSearchAsync(string naturalLanguageQuery, CancellationToken cancellationToken = default);
}
