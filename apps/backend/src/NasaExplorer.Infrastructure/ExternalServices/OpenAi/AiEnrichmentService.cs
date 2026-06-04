using Microsoft.Extensions.Options;
using NasaExplorer.Domain.Entities.Collections;
using NasaExplorer.Domain.Interfaces.Services;
using NasaExplorer.Domain.Models.Ai;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NasaExplorer.Infrastructure.ExternalServices.OpenAi;

public sealed class AiEnrichmentService : IAiEnrichmentService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;
    private readonly OpenAiOptions _options;

    public AiEnrichmentService(HttpClient httpClient, IOptions<OpenAiOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<AiImageEnrichmentResult> EnrichImageAsync(
        string imageTitle,
        string? imageDescription,
        CancellationToken cancellationToken = default)
    {
        string fallbackDescription = $"AI enrichment is unavailable. NASA image: {imageTitle}.";
        string fallbackContext = "Historical context is unavailable until OpenAI is configured.";

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return new AiImageEnrichmentResult(fallbackDescription, ["space exploration", "NASA archive"], fallbackContext);
        }

        string userPrompt = $"""
            Title: {imageTitle}
            NASA description: {imageDescription ?? "No description provided."}
            Return JSON with string description, string[] funFacts, and string historicalContext.
            """;

        string content = await CreateChatCompletionAsync(OpenAiPrompts.EnrichImage, userPrompt, fallbackDescription, cancellationToken);
        AiEnrichmentResponse? parsed = TryDeserialize<AiEnrichmentResponse>(content);

        return new AiImageEnrichmentResult(
            string.IsNullOrWhiteSpace(parsed?.Description) ? fallbackDescription : parsed.Description,
            parsed?.FunFacts?.Where(fact => !string.IsNullOrWhiteSpace(fact)).ToArray() ?? ["space exploration", "NASA archive"],
            string.IsNullOrWhiteSpace(parsed?.HistoricalContext) ? fallbackContext : parsed.HistoricalContext);
    }

    public async Task<string> CompareImagesAsync(IReadOnlyCollection<CollectionImage> images, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return "AI comparison is unavailable until OpenAI is configured.";
        }

        string imageList = string.Join(
            Environment.NewLine,
            images.Select(image => $"- {image.SpaceImage?.Title ?? image.SpaceImageId.ToString()}: {image.SpaceImage?.Description ?? "No description."}"));

        return await CreateChatCompletionAsync(
            OpenAiPrompts.CompareImages,
            $"Compare these images:\n{imageList}",
            "AI comparison is unavailable.",
            cancellationToken);
    }

    public async Task<IReadOnlyCollection<string>> SuggestTagsAsync(
        string imageTitle,
        string? imageDescription,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return BuildFallbackTags(imageTitle);
        }

        string content = await CreateChatCompletionAsync(
            OpenAiPrompts.SuggestTags,
            $"Title: {imageTitle}\nDescription: {imageDescription ?? "No description provided."}",
            "[]",
            cancellationToken);
        string[]? parsed = TryDeserialize<string[]>(content);

        return (parsed ?? BuildFallbackTags(imageTitle))
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag.Trim().ToLowerInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(8)
            .ToArray();
    }

    public async Task<string> CreateSemanticSearchAsync(string naturalLanguageQuery, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return naturalLanguageQuery.Trim();
        }

        return await CreateChatCompletionAsync(
            OpenAiPrompts.SemanticSearch,
            naturalLanguageQuery,
            naturalLanguageQuery.Trim(),
            cancellationToken);
    }

    private async Task<string> CreateChatCompletionAsync(
        string systemPrompt,
        string userPrompt,
        string fallback,
        CancellationToken cancellationToken)
    {
        using HttpRequestMessage request = new(HttpMethod.Post, "chat/completions")
        {
            Content = JsonContent.Create(new ChatCompletionRequest(
                _options.Model,
                [
                    new ChatMessage("system", systemPrompt),
                    new ChatMessage("user", userPrompt)
                ]))
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        using HttpResponseMessage response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return fallback;
        }

        await using Stream stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        ChatCompletionResponse? completion = await JsonSerializer.DeserializeAsync<ChatCompletionResponse>(stream, JsonOptions, cancellationToken);

        return completion?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? fallback;
    }

    private static IReadOnlyCollection<string> BuildFallbackTags(string imageTitle)
    {
        return imageTitle
            .Split([' ', ',', '.', ':', ';', '-', '_'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(term => term.Length > 2)
            .Select(term => term.ToLowerInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(5)
            .DefaultIfEmpty("nasa")
            .ToArray();
    }

    private static T? TryDeserialize<T>(string content)
    {
        try
        {
            return JsonSerializer.Deserialize<T>(content, JsonOptions);
        }
        catch (JsonException)
        {
            return default;
        }
    }

    private sealed record ChatCompletionRequest(string Model, IReadOnlyCollection<ChatMessage> Messages);

    private sealed record ChatMessage(string Role, string Content);

    private sealed class ChatCompletionResponse
    {
        public IReadOnlyCollection<ChatChoice>? Choices { get; set; }
    }

    private sealed class ChatChoice
    {
        public ChatChoiceMessage? Message { get; set; }
    }

    private sealed class ChatChoiceMessage
    {
        public string? Content { get; set; }
    }

    private sealed class AiEnrichmentResponse
    {
        public string? Description { get; set; }

        [JsonPropertyName("funFacts")]
        public IReadOnlyCollection<string>? FunFacts { get; set; }

        public string? HistoricalContext { get; set; }
    }
}
