using MediatR;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Ai;
using NasaExplorer.Domain.Entities.Images;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Ai;
using System.Text.Json;

namespace NasaExplorer.Application.Features.Ai.Commands.EnrichImage;

public sealed class EnrichImageCommandHandler : IRequestHandler<EnrichImageCommand, EnrichmentResultDto>
{
    private const string EnrichmentType = "Description";
    private const string Provider = "OpenAI";
    private const string Model = "gpt-4o-mini";
    private const string Prompt = "Generate description, fun facts, and historical context for a NASA image.";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly ISpaceImageRepository _spaceImageRepository;
    private readonly IImageEnrichmentRepository _imageEnrichmentRepository;
    private readonly IAiEnrichmentService _aiEnrichmentService;
    private readonly ICurrentUserService _currentUserService;

    public EnrichImageCommandHandler(
        ISpaceImageRepository spaceImageRepository,
        IImageEnrichmentRepository imageEnrichmentRepository,
        IAiEnrichmentService aiEnrichmentService,
        ICurrentUserService currentUserService)
    {
        _spaceImageRepository = spaceImageRepository;
        _imageEnrichmentRepository = imageEnrichmentRepository;
        _aiEnrichmentService = aiEnrichmentService;
        _currentUserService = currentUserService;
    }

    public async Task<EnrichmentResultDto> Handle(EnrichImageCommand request, CancellationToken cancellationToken)
    {
        Guid userId = _currentUserService.GetRequiredUserId();
        DateTimeOffset now = DateTimeOffset.UtcNow;
        SpaceImage spaceImage = await GetOrCreateSpaceImageAsync(request, now, cancellationToken);
        ImageEnrichment? cached = await _imageEnrichmentRepository.GetBySpaceImageUserAndTypeAsync(
            spaceImage.Id,
            userId,
            EnrichmentType,
            cancellationToken);

        if (cached is not null)
        {
            return ToDto(spaceImage, JsonSerializer.Deserialize<AiImageEnrichmentResult>(cached.Content, JsonOptions)!, true);
        }

        AiImageEnrichmentResult enrichment = await _aiEnrichmentService.EnrichImageAsync(
            spaceImage.Title,
            spaceImage.Description,
            cancellationToken);
        string content = JsonSerializer.Serialize(enrichment, JsonOptions);

        await _imageEnrichmentRepository.AddAsync(
            ImageEnrichment.Create(spaceImage.Id, userId, EnrichmentType, Prompt, content, Model, Provider, now),
            cancellationToken);

        return ToDto(spaceImage, enrichment, false);
    }

    private async Task<SpaceImage> GetOrCreateSpaceImageAsync(
        EnrichImageCommand request,
        DateTimeOffset now,
        CancellationToken cancellationToken)
    {
        SpaceImage? existingImage = await _spaceImageRepository.GetByNasaIdAsync(request.NasaImageId, cancellationToken);
        if (existingImage is not null)
        {
            return existingImage;
        }

        string sourceUrl = string.IsNullOrWhiteSpace(request.SourceUrl)
            ? $"https://images.nasa.gov/details/{Uri.EscapeDataString(request.NasaImageId)}"
            : request.SourceUrl;
        SpaceImage image = SpaceImage.Create(
            request.NasaImageId,
            request.Title,
            request.Description,
            string.IsNullOrWhiteSpace(request.ImageUrl) ? sourceUrl : request.ImageUrl,
            request.ThumbnailUrl,
            sourceUrl,
            "image",
            null,
            null,
            null,
            null,
            request.DateCreated,
            null,
            now);

        await _spaceImageRepository.AddAsync(image, cancellationToken);

        return image;
    }

    private static EnrichmentResultDto ToDto(SpaceImage spaceImage, AiImageEnrichmentResult enrichment, bool fromCache)
    {
        return new EnrichmentResultDto
        {
            SpaceImageId = spaceImage.Id,
            NasaImageId = spaceImage.NasaId,
            Description = enrichment.Description,
            FunFacts = enrichment.FunFacts,
            HistoricalContext = enrichment.HistoricalContext,
            FromCache = fromCache
        };
    }
}
