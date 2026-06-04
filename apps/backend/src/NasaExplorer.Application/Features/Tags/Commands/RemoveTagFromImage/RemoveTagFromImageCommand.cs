using MediatR;

namespace NasaExplorer.Application.Features.Tags.Commands.RemoveTagFromImage;

public sealed record RemoveTagFromImageCommand(Guid CollectionImageId, Guid TagId) : IRequest;
