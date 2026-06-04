using MediatR;
using NasaExplorer.Application.DTOs.Tags;

namespace NasaExplorer.Application.Features.Tags.Commands.SuggestImageTags;

public sealed record SuggestImageTagsCommand(Guid CollectionImageId) : IRequest<TagSuggestionsDto>;
