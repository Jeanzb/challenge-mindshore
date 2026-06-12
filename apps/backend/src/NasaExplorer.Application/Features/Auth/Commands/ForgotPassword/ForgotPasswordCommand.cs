using MediatR;
using NasaExplorer.Application.DTOs.Auth;

namespace NasaExplorer.Application.Features.Auth.Commands.ForgotPassword;

public sealed record ForgotPasswordCommand(string Email) : IRequest<ForgotPasswordResponseDto>;
