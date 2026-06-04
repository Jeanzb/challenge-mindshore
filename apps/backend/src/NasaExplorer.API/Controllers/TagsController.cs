using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.DTOs.Collections;
using NasaExplorer.Application.Features.Tags.Commands.AddTagToImage;
using NasaExplorer.Application.Features.Tags.Commands.RemoveTagFromImage;
using NasaExplorer.Application.Features.Tags.Commands.SuggestImageTags;

namespace NasaExplorer.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class TagsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("images/{imageId:guid}")]
    public async Task<IActionResult> AddToImage(
        [FromRoute] Guid imageId,
        [FromBody] AddTagToImageRequest request,
        CancellationToken cancellationToken)
    {
        ImageTagDto result = await _mediator.Send(
            new AddTagToImageCommand(imageId, request.Name, request.IsAiGenerated),
            cancellationToken);

        return Ok(result);
    }

    [HttpDelete("images/{imageId:guid}/{tagId:guid}")]
    public async Task<IActionResult> RemoveFromImage(
        [FromRoute] Guid imageId,
        [FromRoute] Guid tagId,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(new RemoveTagFromImageCommand(imageId, tagId), cancellationToken);

        return NoContent();
    }

    [HttpPost("images/{imageId:guid}/suggest")]
    public async Task<IActionResult> SuggestForImage([FromRoute] Guid imageId, CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(new SuggestImageTagsCommand(imageId), cancellationToken));
    }
}

public sealed record AddTagToImageRequest(string Name, bool IsAiGenerated);
