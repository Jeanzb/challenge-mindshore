using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollection;

public sealed class UpdateCollectionCommandHandler : IRequestHandler<UpdateCollectionCommand, CollectionSummaryDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCollectionCommandHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionSummaryDto> Handle(UpdateCollectionCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.Id, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");

        collection.Update(request.Name, request.Description, DateTimeOffset.UtcNow);

        await _collectionRepository.UpdateAsync(collection, cancellationToken);

        return new CollectionSummaryDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            ImageCount = collection.Images.Count,
            CreatedAt = collection.CreatedAt,
            UpdatedAt = collection.UpdatedAt
        };
    }
}
