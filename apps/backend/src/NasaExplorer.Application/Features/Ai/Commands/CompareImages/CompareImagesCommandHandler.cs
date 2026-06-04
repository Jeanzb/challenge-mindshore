using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Ai;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Ai.Commands.CompareImages;

public sealed class CompareImagesCommandHandler : IRequestHandler<CompareImagesCommand, ComparisonResultDto>
{
    private const string Model = "gpt-4o-mini";
    private const string Prompt = "Compare selected NASA collection images.";

    private readonly ICollectionRepository _collectionRepository;
    private readonly IImageComparisonRepository _imageComparisonRepository;
    private readonly IAiEnrichmentService _aiEnrichmentService;
    private readonly ICurrentUserService _currentUserService;

    public CompareImagesCommandHandler(
        ICollectionRepository collectionRepository,
        IImageComparisonRepository imageComparisonRepository,
        IAiEnrichmentService aiEnrichmentService,
        ICurrentUserService currentUserService)
    {
        _collectionRepository = collectionRepository;
        _imageComparisonRepository = imageComparisonRepository;
        _aiEnrichmentService = aiEnrichmentService;
        _currentUserService = currentUserService;
    }

    public async Task<ComparisonResultDto> Handle(CompareImagesCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        IReadOnlyCollection<CollectionImage> images = await _collectionRepository.GetImagesByIdsForUserAsync(
            request.ImageIds,
            userId,
            cancellationToken);

        if (images.Count != request.ImageIds.Count)
        {
            throw new NotFoundException("One or more collection images were not found.");
        }

        string analysis = await _aiEnrichmentService.CompareImagesAsync(images, cancellationToken);
        DateTimeOffset now = DateTimeOffset.UtcNow;
        Guid[] spaceImageIds = images
            .OrderBy(image => request.ImageIds.ToList().IndexOf(image.Id))
            .Select(image => image.SpaceImageId)
            .ToArray();
        ImageComparison comparison = ImageComparison.Create(userId, request.Title, analysis, Prompt, Model, now, spaceImageIds);

        await _imageComparisonRepository.AddAsync(comparison, cancellationToken);

        return new ComparisonResultDto
        {
            Id = comparison.Id,
            Title = comparison.Title,
            Analysis = comparison.Analysis,
            ImageIds = request.ImageIds,
            CreatedAt = comparison.CreatedAt
        };
    }
}
