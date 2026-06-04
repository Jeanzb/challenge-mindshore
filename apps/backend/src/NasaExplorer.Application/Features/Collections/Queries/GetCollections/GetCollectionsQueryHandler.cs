using MediatR;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Queries.GetCollections;

public sealed class GetCollectionsQueryHandler : IRequestHandler<GetCollectionsQuery, IReadOnlyCollection<CollectionSummaryDto>>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetCollectionsQueryHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyCollection<CollectionSummaryDto>> Handle(GetCollectionsQuery request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        IReadOnlyCollection<Collection> collections = await _collectionRepository.GetByUserIdAsync(userId, cancellationToken);

        return collections.Select(collection => new CollectionSummaryDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            ImageCount = collection.Images.Count,
            CreatedAt = collection.CreatedAt,
            UpdatedAt = collection.UpdatedAt
        }).ToArray();
    }
}
