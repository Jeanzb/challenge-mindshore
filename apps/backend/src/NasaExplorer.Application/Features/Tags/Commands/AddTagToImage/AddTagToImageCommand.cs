using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Tags.Commands.AddTagToImage;

public sealed record AddTagToImageCommand(
    Guid CollectionImageId,
    string Name,
    bool IsAiGenerated) : IRequest<ImageTagDto>;
