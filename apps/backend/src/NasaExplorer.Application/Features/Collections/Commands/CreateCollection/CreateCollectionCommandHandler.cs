using MediatR;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Commands.CreateCollection;

public sealed class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand, CollectionSummaryDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateCollectionCommandHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionSummaryDto> Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = Collection.Create(userId, request.Name, request.Description, DateTimeOffset.UtcNow);

        await _collectionRepository.AddAsync(collection, cancellationToken);

        return new CollectionSummaryDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            ImageCount = 0,
            CreatedAt = collection.CreatedAt,
            UpdatedAt = collection.UpdatedAt
        };
    }
}
