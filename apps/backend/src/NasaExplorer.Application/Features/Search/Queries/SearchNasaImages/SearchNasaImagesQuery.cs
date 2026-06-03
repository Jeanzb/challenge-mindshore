using MediatR;
using NasaExplorer.Application.DTOs.Search;

namespace NasaExplorer.Application.Features.Search.Queries.SearchNasaImages;

public sealed record SearchNasaImagesQuery(
    string Query,
    DateOnly? DateFrom,
    DateOnly? DateTo,
    string? Rover,
    string? Camera,
    string? Mission,
    int Page,
    int PageSize) : IRequest<NasaSearchResultDto>;
