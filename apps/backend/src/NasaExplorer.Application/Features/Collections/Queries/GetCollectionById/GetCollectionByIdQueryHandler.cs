using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;

public sealed class GetCollectionByIdQueryHandler : IRequestHandler<GetCollectionByIdQuery, CollectionDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetCollectionByIdQueryHandler(
        ICollectionRepository collectionRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionDto> Handle(GetCollectionByIdQuery request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.Id, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");

        return new CollectionDto
        {
            Id = collection.Id,
            Name = collection.Name,
            Description = collection.Description,
            CreatedAt = collection.CreatedAt,
            UpdatedAt = collection.UpdatedAt,
            Images = collection.Images
                .OrderBy(image => image.SortOrder)
                .Where(image => image.SpaceImage is not null)
                .Select(image => new CollectionImageDto
                {
                    Id = image.Id,
                    SpaceImageId = image.SpaceImageId,
                    NasaImageId = image.SpaceImage!.NasaId,
                    Title = image.SpaceImage.Title,
                    Description = image.SpaceImage.Description,
                    ImageUrl = image.SpaceImage.ImageUrl,
                    ThumbnailUrl = image.SpaceImage.ThumbnailUrl,
                    UserNote = image.UserNote,
                    SortOrder = image.SortOrder,
                    DateCreated = image.SpaceImage.DateCreated,
                    Tags = image.SpaceImage.ImageTags
                        .Where(imageTag => imageTag.Tag is not null)
                        .Select(imageTag => new ImageTagDto
                        {
                            Id = imageTag.Tag!.Id,
                            Name = imageTag.Tag.Name,
                            IsAiGenerated = imageTag.Tag.IsAiGenerated
                        })
                        .OrderBy(tag => tag.Name)
                        .ToArray()
                })
                .ToArray()
        };
    }
}
