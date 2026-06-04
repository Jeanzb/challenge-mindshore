using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Commands.AddImageToCollection;

public sealed record AddImageToCollectionCommand(
    Guid CollectionId,
    string NasaImageId,
    string Title,
    string? Description,
    string ImageUrl,
    string? ThumbnailUrl,
    string? SourceUrl,
    string MediaType,
    string? Center,
    string? Mission,
    string? Rover,
    string? Camera,
    DateTimeOffset? DateCreated,
    string? Keywords,
    string? UserNote) : IRequest<CollectionImageDto>;
