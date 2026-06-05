using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Collections.Commands.AddImageToCollection;

public sealed class AddImageToCollectionCommandHandler : IRequestHandler<AddImageToCollectionCommand, CollectionImageDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ISpaceImageRepository _spaceImageRepository;
    private readonly ICurrentUserService _currentUserService;

    public AddImageToCollectionCommandHandler(
        ICollectionRepository collectionRepository,
        ISpaceImageRepository spaceImageRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _spaceImageRepository = spaceImageRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CollectionImageDto> Handle(AddImageToCollectionCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        Collection collection = await _collectionRepository.GetByIdForUserAsync(request.CollectionId, userId, cancellationToken)
            ?? throw new NotFoundException("Collection not found.");

        SpaceImage? existingImage = await _spaceImageRepository.GetByNasaIdAsync(request.NasaImageId, cancellationToken);
        bool imageAlreadyExists = collection.Images.Any(image =>
            existingImage is not null && image.SpaceImageId == existingImage.Id
            || image.SpaceImage?.NasaId == request.NasaImageId);
        if (imageAlreadyExists)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                [nameof(AddImageToCollectionCommand.NasaImageId)] = ["Image already exists in this collection."]
            });
        }

        DateTimeOffset now = DateTimeOffset.UtcNow;
        SpaceImage spaceImage = existingImage ?? SpaceImage.Create(
            request.NasaImageId,
            request.Title,
            request.Description,
            request.ImageUrl,
            request.ThumbnailUrl,
            request.SourceUrl,
            request.MediaType,
            request.Center,
            request.Mission,
            request.Rover,
            request.Camera,
            request.DateCreated,
            request.Keywords,
            now);

        if (existingImage is null)
        {
            await _spaceImageRepository.AddAsync(spaceImage, cancellationToken);
        }

        int sortOrder = collection.Images.Count == 0
            ? 0
            : collection.Images.Max(image => image.SortOrder) + 1;
        CollectionImage collectionImage = CollectionImage.Create(collection.Id, spaceImage.Id, request.UserNote, sortOrder, now);
        collection.Images.Add(collectionImage);

        await _collectionRepository.AddImageAsync(collectionImage, cancellationToken);

        return new CollectionImageDto
        {
            Id = collectionImage.Id,
            SpaceImageId = spaceImage.Id,
            NasaImageId = spaceImage.NasaId,
            Title = spaceImage.Title,
            Description = spaceImage.Description,
            ImageUrl = spaceImage.ImageUrl,
            ThumbnailUrl = spaceImage.ThumbnailUrl,
            UserNote = collectionImage.UserNote,
            SortOrder = collectionImage.SortOrder,
            DateCreated = spaceImage.DateCreated
        };
    }
}
