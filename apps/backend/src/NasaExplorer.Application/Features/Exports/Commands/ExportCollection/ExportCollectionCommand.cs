using MediatR;
using NasaExplorer.Application.DTOs.Exports;

namespace NasaExplorer.Application.Features.Exports.Commands.ExportCollection;

public sealed record ExportCollectionCommand(Guid CollectionId, string Format) : IRequest<CollectionExportResultDto>;
