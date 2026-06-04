using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Tags.Commands.RemoveTagFromImage;

public sealed class RemoveTagFromImageCommandHandler : IRequestHandler<RemoveTagFromImageCommand>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ITagRepository _tagRepository;
    private readonly ICurrentUserService _currentUserService;

    public RemoveTagFromImageCommandHandler(
        ICollectionRepository collectionRepository,
        ITagRepository tagRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _tagRepository = tagRepository;
        _currentUserService = currentUserService;
    }

    public async Task Handle(RemoveTagFromImageCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        CollectionImage collectionImage = (await _collectionRepository.GetImagesByIdsForUserAsync(
                [request.CollectionImageId],
                userId,
                cancellationToken))
            .SingleOrDefault()
            ?? throw new NotFoundException("Collection image not found.");
        ImageTag imageTag = await _tagRepository.GetImageTagForUserAsync(
                collectionImage.SpaceImageId,
                request.TagId,
                userId,
                cancellationToken)
            ?? throw new NotFoundException("Image tag not found.");

        await _tagRepository.RemoveImageTagAsync(imageTag, cancellationToken);
    }
}
