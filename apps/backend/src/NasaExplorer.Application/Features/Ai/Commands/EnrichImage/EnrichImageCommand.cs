using MediatR;
using NasaExplorer.Application.DTOs.Ai;

namespace NasaExplorer.Application.Features.Ai.Commands.EnrichImage;

public sealed record EnrichImageCommand(
    string NasaImageId,
    string Title,
    string? Description,
    string? ImageUrl,
    string? ThumbnailUrl,
    string? SourceUrl,
    DateTimeOffset? DateCreated) : IRequest<EnrichmentResultDto>;
