using MediatR;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Common.Interfaces;
using NasaExplorer.Domain.Entities.Users;
using NasaExplorer.Domain.Interfaces.Repositories;
using NasaExplorer.Domain.Interfaces.Services;

namespace NasaExplorer.Application.Features.Auth.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHashService _passwordHashService;

    public ResetPasswordCommandHandler(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHashService passwordHashService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHashService = passwordHashService;
    }

    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        string tokenHash = _jwtService.HashRefreshToken(request.Token);
        User user = await _userRepository.GetByPasswordResetTokenAsync(tokenHash, cancellationToken)
            ?? throw new UnauthorizedException("This password reset link is invalid.");

        if (user.PasswordResetTokenExpiresAt is null || user.PasswordResetTokenExpiresAt <= DateTimeOffset.UtcNow)
        {
            user.ClearPasswordResetToken();
            await _userRepository.UpdateAsync(user, cancellationToken);
            throw new UnauthorizedException("This password reset link has expired.");
        }

        user.ResetPassword(_passwordHashService.HashPassword(request.NewPassword));
        await _userRepository.UpdateAsync(user, cancellationToken);

        return Unit.Value;
    }
}
