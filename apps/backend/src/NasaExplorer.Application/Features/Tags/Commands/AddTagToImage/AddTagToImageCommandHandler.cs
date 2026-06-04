using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;

namespace NasaExplorer.Application.Features.Tags.Commands.AddTagToImage;

public sealed class AddTagToImageCommandHandler : IRequestHandler<AddTagToImageCommand, ImageTagDto>
{
    private readonly ICollectionRepository _collectionRepository;
    private readonly ITagRepository _tagRepository;
    private readonly ICurrentUserService _currentUserService;

    public AddTagToImageCommandHandler(
        ICollectionRepository collectionRepository,
        ITagRepository tagRepository,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _tagRepository = tagRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ImageTagDto> Handle(AddTagToImageCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        CollectionImage collectionImage = (await _collectionRepository.GetImagesByIdsForUserAsync(
                [request.CollectionImageId],
                userId,
                cancellationToken))
            .SingleOrDefault()
            ?? throw new NotFoundException("Collection image not found.");
        Tag tag = await GetOrCreateTagAsync(request, userId, cancellationToken);
        ImageTag? existingImageTag = await _tagRepository.GetImageTagForUserAsync(
            collectionImage.SpaceImageId,
            tag.Id,
            userId,
            cancellationToken);

        if (existingImageTag is null)
        {
            await _tagRepository.AddImageTagAsync(
                ImageTag.Create(collectionImage.SpaceImageId, tag.Id, DateTimeOffset.UtcNow),
                cancellationToken);
        }

        return new ImageTagDto
        {
            Id = tag.Id,
            Name = tag.Name,
            IsAiGenerated = tag.IsAiGenerated
        };
    }

    private async Task<Tag> GetOrCreateTagAsync(
        AddTagToImageCommand request,
        Guid userId,
        CancellationToken cancellationToken)
    {
        string normalizedName = Tag.NormalizeName(request.Name);
        Tag? existingTag = await _tagRepository.GetByUserAndNormalizedNameAsync(userId, normalizedName, cancellationToken);
        if (existingTag is not null)
        {
            return existingTag;
        }

        Tag tag = Tag.Create(userId, request.Name, request.IsAiGenerated, DateTimeOffset.UtcNow);
        await _tagRepository.AddTagAsync(tag, cancellationToken);

        return tag;
    }
}
