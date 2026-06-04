using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollectionImageNote;

public sealed class UpdateCollectionImageNoteCommandHandler : IRequestHandler<UpdateCollectionImageNoteCommand, CollectionImageDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCollectionImageNoteCommandHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionImageDto> Handle(UpdateCollectionImageNoteCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.CollectionId, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");

        CollectionImage collectionImage = collection.Images.FirstOrDefault(image => image.Id == request.ImageId)
            ?? throw new NotFoundException("Collection image not found.");
        SpaceImage spaceImage = collectionImage.SpaceImage
            ?? throw new NotFoundException("Space image not found.");

        collectionImage.UpdateNote(request.UserNote);

        await _collectionRepository.UpdateAsync(collection, cancellationToken);

        return new CollectionImageDto
        {
            Id = collectionImage.Id,
            SpaceImageId = collectionImage.SpaceImageId,
            NasaImageId = spaceImage.NasaId,
            Title = spaceImage.Title,
            Description = spaceImage.Description,
            ImageUrl = spaceImage.ImageUrl,
            ThumbnailUrl = spaceImage.ThumbnailUrl,
            UserNote = collectionImage.UserNote,
            SortOrder = collectionImage.SortOrder,
            DateCreated = spaceImage.DateCreated,
            Tags = spaceImage.ImageTags
                .Where(imageTag => imageTag.Tag is not null)
                .Select(imageTag => new ImageTagDto
                {
                    Id = imageTag.Tag!.Id,
                    Name = imageTag.Tag.Name,
                    IsAiGenerated = imageTag.Tag.IsAiGenerated
                })
                .OrderBy(tag => tag.Name)
                .ToArray()
        };
    }
}
