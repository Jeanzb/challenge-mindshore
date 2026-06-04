using MediatR;

namespace NasaExplorer.Application.Features.Collections.Commands.RemoveImageFromCollection;

public sealed record RemoveImageFromCollectionCommand(Guid CollectionId, Guid ImageId) : IRequest;
