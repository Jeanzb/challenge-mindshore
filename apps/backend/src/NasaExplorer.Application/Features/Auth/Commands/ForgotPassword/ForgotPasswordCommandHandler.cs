using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Auth;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Auth.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponseDto>
{
    private const int ResetTokenLifetimeMinutes = 15;

    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public ForgotPasswordCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<ForgotPasswordResponseDto> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        User user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken)
            ?? throw new NotFoundException("No account is registered with that email.");

        DateTimeOffset expiresAt = DateTimeOffset.UtcNow.AddMinutes(ResetTokenLifetimeMinutes);
        string resetToken = _jwtService.GenerateRefreshToken();
        user.SetPasswordResetToken(_jwtService.HashRefreshToken(resetToken), expiresAt);

        await _userRepository.UpdateAsync(user, cancellationToken);

        return new ForgotPasswordResponseDto
        {
            ResetToken = resetToken,
            ExpiresAt = expiresAt
        };
    }
}
