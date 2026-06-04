using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NasaExplorer.Application.DTOs.Exports;
using NasaExplorer.Application.Features.Exports.Commands.ExportCollection;

namespace NasaExplorer.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class ExportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("collections/{collectionId:guid}/pdf")]
    public async Task<IActionResult> ExportCollectionPdf(
        [FromRoute] Guid collectionId,
        CancellationToken cancellationToken)
    {
        CollectionExportResultDto result = await _mediator.Send(
            new ExportCollectionCommand(collectionId, "PDF"),
            cancellationToken);

        return File(result.Content, result.ContentType, result.FileName);
    }
}
