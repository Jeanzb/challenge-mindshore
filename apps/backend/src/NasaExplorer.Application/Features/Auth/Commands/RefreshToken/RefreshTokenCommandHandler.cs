using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Auth;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Auth.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        string refreshTokenHash = _jwtService.HashRefreshToken(request.RefreshToken);
        User user = await _userRepository.GetByRefreshTokenAsync(refreshTokenHash, cancellationToken)
            ?? throw new UnauthorizedException("Invalid refresh token.");

        if (user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt <= DateTimeOffset.UtcNow)
        {
            user.ClearRefreshToken();
            await _userRepository.UpdateAsync(user, cancellationToken);
            throw new UnauthorizedException("Refresh token expired.");
        }

        DateTimeOffset now = DateTimeOffset.UtcNow;
        string refreshToken = _jwtService.GenerateRefreshToken();
        user.SetRefreshToken(_jwtService.HashRefreshToken(refreshToken), now.AddDays(7));

        await _userRepository.UpdateAsync(user, cancellationToken);

        return new LoginResponseDto
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = refreshToken,
            User = new AuthenticatedUserDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName
            }
        };
    }
}
