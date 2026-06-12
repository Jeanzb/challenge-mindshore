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

    private static readonly JsonSerializerOptions RequestJsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

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
        string fallbackDescription = $"NASA archive image: {imageTitle}.";
        string fallbackContext = $"This NASA archive image, {imageTitle}, can be explored through its mission context, capture date, source center, and related imagery to understand how it fits into the broader history of space exploration.";

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return new AiImageEnrichmentResult(fallbackDescription, ["space exploration", "NASA archive"], fallbackContext);
        }

        string userPrompt = $"""
            Title: {imageTitle}
            NASA description: {imageDescription ?? "No description provided."}
            Return JSON with string description, string[] funFacts, and string historicalContext.
            """;

        string content = await CreateChatCompletionAsync(OpenAiPrompts.EnrichImage, userPrompt, fallbackDescription, cancellationToken, expectJson: true);
        AiEnrichmentResponse? parsed = TryDeserialize<AiEnrichmentResponse>(content);

        return new AiImageEnrichmentResult(
            string.IsNullOrWhiteSpace(parsed?.Description) ? fallbackDescription : parsed.Description,
            parsed?.FunFacts?.Where(fact => !string.IsNullOrWhiteSpace(fact)).ToArray() ?? ["space exploration", "NASA archive"],
            string.IsNullOrWhiteSpace(parsed?.HistoricalContext) ? fallbackContext : parsed.HistoricalContext);
    }

    public async Task<string> CompareImagesAsync(
        IReadOnlyCollection<CollectionImage> images,
        string language,
        CancellationToken cancellationToken = default)
    {
        string normalizedLanguage = language.Equals("es", StringComparison.OrdinalIgnoreCase) ? "es" : "en";
        string fallback = BuildComparisonFallback(images, normalizedLanguage);

        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            return fallback;
        }

        string imageList = string.Join(
            Environment.NewLine,
            images.Select(image => $"- {image.SpaceImage?.Title ?? image.SpaceImageId.ToString()}: {image.SpaceImage?.Description ?? "No description."}"));

        string content = await CreateChatCompletionAsync(
            OpenAiPrompts.CompareImages,
            $"Respond in {(normalizedLanguage == "es" ? "Spanish" : "English")}.\nCompare these images:\n{imageList}",
            fallback,
            cancellationToken,
            expectJson: true);

        return ExtractJsonPayload(content);
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
            cancellationToken,
            expectJson: true);
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
        CancellationToken cancellationToken,
        bool expectJson = false)
    {
        using HttpRequestMessage request = new(HttpMethod.Post, "chat/completions")
        {
            Content = JsonContent.Create(new ChatCompletionRequest(
                _options.Model,
                [
                    new ChatMessage("system", systemPrompt),
                    new ChatMessage("user", userPrompt)
                ],
                expectJson ? new ChatResponseFormat("json_object") : null), options: RequestJsonOptions)
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
            return JsonSerializer.Deserialize<T>(ExtractJsonPayload(content), JsonOptions);
        }
        catch (JsonException)
        {
            return default;
        }
    }

    private static string ExtractJsonPayload(string content)
    {
        string trimmed = content.Trim();

        if (!trimmed.StartsWith("```", StringComparison.Ordinal))
        {
            return trimmed;
        }

        int firstLineEnd = trimmed.IndexOf('\n');
        int closingFence = trimmed.LastIndexOf("```", StringComparison.Ordinal);

        if (firstLineEnd < 0 || closingFence <= firstLineEnd)
        {
            return trimmed;
        }

        return trimmed[(firstLineEnd + 1)..closingFence].Trim();
    }

    private static string BuildComparisonFallback(IReadOnlyCollection<CollectionImage> images, string language)
    {
        string titles = string.Join(", ", images.Select(image => image.SpaceImage?.Title ?? image.SpaceImageId.ToString()).Take(4));

        object fallback = language == "es"
            ? new
            {
                title = "Comparación de imágenes NASA",
                summary = $"Estas imágenes guardadas permiten contrastar {titles} usando sus títulos, descripciones y metadatos disponibles.",
                similarities = new[] { "Todas pertenecen al archivo visual de NASA.", "Cada imagen puede analizarse por misión, fecha, centro de origen y contenido visual." },
                differences = new[] { "Las imágenes pueden variar por misión, instrumento, época y objetivo científico.", "El contexto visual depende de los metadatos disponibles para cada registro." },
                historicalContext = "El contexto histórico puede revisarse a partir de la misión, la fecha, el centro de origen y la descripción archivada de cada imagen.",
                scientificValue = "La comparación ayuda a revisar patrones visuales, objetivos de exploración y metadatos científicos disponibles.",
                conclusion = "Estas imágenes ofrecen una base clara para comparar momentos, instrumentos y objetivos dentro del archivo visual de NASA."
            }
            : new
            {
                title = "NASA image comparison",
                summary = $"These saved images can be compared through {titles} using their available titles, descriptions, and metadata.",
                similarities = new[] { "They all belong to NASA's visual archive.", "Each image can be reviewed by mission, date, source center, and visible subject matter." },
                differences = new[] { "The images may differ by mission, instrument, era, and scientific objective.", "Visual context depends on the metadata available for each record." },
                historicalContext = "Historical context can be reviewed through each image's mission, date, source center, and archived description.",
                scientificValue = "The comparison helps review visual patterns, exploration goals, and available scientific metadata.",
                conclusion = "These images provide a clear basis for comparing moments, instruments, and objectives across NASA's visual archive."
            };

        return JsonSerializer.Serialize(fallback, JsonOptions);
    }

    private sealed record ChatCompletionRequest(
        string Model,
        IReadOnlyCollection<ChatMessage> Messages,
        [property: JsonPropertyName("response_format")] ChatResponseFormat? ResponseFormat = null);

    private sealed record ChatResponseFormat(string Type);

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
