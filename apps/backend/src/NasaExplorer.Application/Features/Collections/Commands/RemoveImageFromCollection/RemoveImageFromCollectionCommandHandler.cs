using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Commands.RemoveImageFromCollection;

public sealed class RemoveImageFromCollectionCommandHandler : IRequestHandler<RemoveImageFromCollectionCommand>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public RemoveImageFromCollectionCommandHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(RemoveImageFromCollectionCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.CollectionId, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");

        CollectionImage collectionImage = collection.Images.FirstOrDefault(image => image.Id == request.ImageId)
            ?? throw new NotFoundException("Collection image not found.");

        collection.Images.Remove(collectionImage);

        await _collectionRepository.UpdateAsync(collection, cancellationToken);
    }
}
