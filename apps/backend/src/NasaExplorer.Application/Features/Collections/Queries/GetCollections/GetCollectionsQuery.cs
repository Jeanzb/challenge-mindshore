using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Queries.GetCollections;

public sealed record GetCollectionsQuery : IRequest<IReadOnlyCollection<CollectionSummaryDto>>;
