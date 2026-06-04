using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Collections.Commands.CreateCollection;
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCollectionCommand command, CancellationToken cancellationToken)
    {
        CollectionSummaryDto result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}
