namespace NasaExplorer.Application.DTOs.Search;

public sealed class NasaImageTimelineDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public int Day { get; set; }

    public string Date { get; set; } = string.Empty;
}
