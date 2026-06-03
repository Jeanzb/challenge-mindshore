using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Application.DTOs.Auth;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Auth.Commands.RegisterUser;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtService _jwtService;

    public RegisterUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHashService passwordHashService,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHashService = passwordHashService;
        _jwtService = jwtService;
    }

    public async Task<RegisterResponseDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        User? existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (existingUser is not null)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["Email"] = ["Email is already registered."]
            });
        }

        DateTimeOffset createdAt = DateTimeOffset.UtcNow;
        User user = User.Create(
            request.Email,
            _passwordHashService.HashPassword(request.Password),
            request.DisplayName,
            createdAt);

        string refreshToken = _jwtService.GenerateRefreshToken();
        user.SetRefreshToken(_jwtService.HashRefreshToken(refreshToken), createdAt.AddDays(7));

        await _userRepository.AddAsync(user, cancellationToken);

        return new RegisterResponseDto
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
