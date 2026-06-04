using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Commands.CreateCollection;

public sealed record CreateCollectionCommand(string Name, string? Description) : IRequest<CollectionSummaryDto>;
