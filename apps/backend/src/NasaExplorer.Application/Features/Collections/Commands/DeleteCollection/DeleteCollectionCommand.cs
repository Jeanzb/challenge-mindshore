using MediatR;

namespace NasaExplorer.Application.Features.Collections.Commands.DeleteCollection;

public sealed record DeleteCollectionCommand(Guid Id) : IRequest;
