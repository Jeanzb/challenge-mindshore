using MediatR;
using NasaExplorer.Application.DTOs.Auth;

namespace NasaExplorer.Application.Features.Auth.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponseDto>;
