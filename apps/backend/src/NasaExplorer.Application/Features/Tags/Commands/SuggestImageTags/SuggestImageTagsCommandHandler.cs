using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Tags;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Tags.Commands.SuggestImageTags;

public sealed class SuggestImageTagsCommandHandler : IRequestHandler<SuggestImageTagsCommand, TagSuggestionsDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly IAiEnrichmentService _aiEnrichmentService;
    private readonly ICurrentUserService _currentUserService;

    public SuggestImageTagsCommandHandler(
        ICollectionRepository collectionRepository,
        IAiEnrichmentService aiEnrichmentService,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _aiEnrichmentService = aiEnrichmentService;
        _currentUserService = currentUserService;
    }

    public async Task<TagSuggestionsDto> Handle(SuggestImageTagsCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        CollectionImage collectionImage = (await _collectionRepository.GetImagesByIdsForUserAsync(
                [request.CollectionImageId],
                userId,
                cancellationToken))
            .SingleOrDefault()
            ?? throw new NotFoundException("Collection image not found.");
        SpaceImage spaceImage = collectionImage.SpaceImage
            ?? throw new NotFoundException("Space image not found.");
        IReadOnlyCollection<string> suggestions = await _aiEnrichmentService.SuggestTagsAsync(
            spaceImage.Title,
            spaceImage.Description,
            cancellationToken);

        return new TagSuggestionsDto
        {
            Tags = suggestions
        };
    }
}
