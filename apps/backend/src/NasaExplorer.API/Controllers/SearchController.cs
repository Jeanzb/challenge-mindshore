using MediatR;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.Features.Search.Queries.SearchNasaImages;

namespace NasaExplorer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class SearchController : ControllerBase
{
    private readonly IMediator _mediator;

    public SearchController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery(Name = "q")] string query,
        [FromQuery] DateOnly? dateFrom,
        [FromQuery] DateOnly? dateTo,
        [FromQuery] string? rover,
        [FromQuery] string? camera,
        [FromQuery] string? mission,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 24,
        CancellationToken cancellationToken = default)
    {
        SearchNasaImagesQuery request = new(
            query,
            dateFrom,
            dateTo,
            rover,
            camera,
            mission,
            page,
            pageSize);

        return Ok(await _mediator.Send(request, cancellationToken));
    }
}
