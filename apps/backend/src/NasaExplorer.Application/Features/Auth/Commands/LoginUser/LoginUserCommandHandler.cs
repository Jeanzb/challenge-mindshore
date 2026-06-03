using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Auth;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Auth.Commands.LoginUser;

public sealed class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, LoginResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtService _jwtService;

    public LoginUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHashService passwordHashService,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHashService = passwordHashService;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        User user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken)
            ?? throw new UnauthorizedException("Invalid credentials.");

        if (!_passwordHashService.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid credentials.");
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
