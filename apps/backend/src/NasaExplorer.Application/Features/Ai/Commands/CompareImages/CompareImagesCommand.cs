using MediatR;
using NasaExplorer.Application.DTOs.Ai;

namespace NasaExplorer.Application.Features.Ai.Commands.CompareImages;

public sealed record CompareImagesCommand(
    IReadOnlyCollection<Guid> ImageIds,
    string? Title,
    string Language = "en") : IRequest<ComparisonResultDto>;
