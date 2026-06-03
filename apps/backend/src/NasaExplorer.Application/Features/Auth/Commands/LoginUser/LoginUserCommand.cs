using MediatR;
using NasaExplorer.Application.DTOs.Auth;

namespace NasaExplorer.Application.Features.Auth.Commands.LoginUser;

public sealed record LoginUserCommand(
    string Email,
    string Password) : IRequest<LoginResponseDto>;
