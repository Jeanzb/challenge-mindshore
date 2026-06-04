using MediatR;
using NasaExplorer.Application.DTOs.Collections;

namespace NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;

public sealed record GetCollectionByIdQuery(Guid Id) : IRequest<CollectionDto>;
