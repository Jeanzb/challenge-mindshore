using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.Features.Collections.Queries.GetCollectionById;
using NasaExplorer.Application.Features.Collections.Queries.GetCollections;

namespace NasaExplorer.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class CollectionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CollectionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetCollectionsQuery(), cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new GetCollectionByIdQuery(id), cancellationToken));
    }
}
