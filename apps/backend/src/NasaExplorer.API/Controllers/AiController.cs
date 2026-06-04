using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.DTOs.Ai;
using NasaExplorer.Application.Features.Ai.Commands.CompareImages;
using NasaExplorer.Application.Features.Ai.Commands.EnrichImage;

namespace NasaExplorer.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class AiController : ControllerBase
{
    private readonly IMediator _mediator;

    public AiController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("enrich")]
    public async Task<IActionResult> Enrich([FromBody] EnrichImageCommand command, CancellationToken cancellationToken)
    {
        EnrichmentResultDto result = await _mediator.Send(command, cancellationToken);

        return Ok(result);
    }

    [HttpPost("compare")]
    public async Task<IActionResult> Compare([FromBody] CompareImagesCommand command, CancellationToken cancellationToken)
    {
        ComparisonResultDto result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(Compare), new { id = result.Id }, result);
    }
}
