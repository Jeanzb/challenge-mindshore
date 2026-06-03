namespace NasaExplorer.Application.DTOs.Auth;

public sealed class RegisterResponseDto
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public AuthenticatedUserDto User { get; set; } = new();
}
