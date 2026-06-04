using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Commands.UpdateCollection;

public sealed record UpdateCollectionCommand(Guid Id, string Name, string? Description) : IRequest<CollectionSummaryDto>;
