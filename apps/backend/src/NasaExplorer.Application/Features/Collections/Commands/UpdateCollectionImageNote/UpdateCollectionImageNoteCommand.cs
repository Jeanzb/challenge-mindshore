using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollectionImageNote;

public sealed record UpdateCollectionImageNoteCommand(
    Guid CollectionId,
    Guid ImageId,
    string? UserNote) : IRequest<CollectionImageDto>;
