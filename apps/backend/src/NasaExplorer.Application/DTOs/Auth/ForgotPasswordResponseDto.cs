namespace NasaExplorer.Application.DTOs.Auth;

public sealed class ForgotPasswordResponseDto
{
    public string ResetToken { get; set; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; set; }
}
