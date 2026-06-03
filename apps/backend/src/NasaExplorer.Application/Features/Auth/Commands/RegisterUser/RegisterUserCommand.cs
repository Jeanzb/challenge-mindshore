using MediatR;
using NasaExplorer.Application.DTOs.Auth;

namespace NasaExplorer.Application.Features.Auth.Commands.RegisterUser;

public sealed record RegisterUserCommand(
    string Email,
    string Password,
    string DisplayName) : IRequest<RegisterResponseDto>;
