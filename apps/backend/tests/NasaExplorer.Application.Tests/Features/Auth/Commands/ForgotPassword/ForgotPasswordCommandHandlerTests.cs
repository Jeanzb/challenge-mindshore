using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.DTOs.Auth;
using NasaExplorer.Application.Features.Auth.Commands.ForgotPassword;
using NasaExplorer.Application.Tests.Features.Auth;
using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Application.Tests.Features.Auth.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandlerTests
{
    [Fact]
    public async Task Handle_issues_a_reset_token_for_an_existing_account()
    {
        User user = AuthTestData.CreateUser("explorer@cosmara.dev");
        FakeUserRepository repository = new(user);
        ForgotPasswordCommandHandler handler = new(repository, new StubJwtService("reset-secret"));

        ForgotPasswordResponseDto result = await handler.Handle(
            new ForgotPasswordCommand("explorer@cosmara.dev"),
            CancellationToken.None);

        Assert.Equal("reset-secret", result.ResetToken);
        Assert.True(result.ExpiresAt > DateTimeOffset.UtcNow);
        Assert.Equal(user, repository.UpdatedUser);
        Assert.Equal("hash:reset-secret", user.PasswordResetTokenHash);
        Assert.NotNull(user.PasswordResetTokenExpiresAt);
    }

    [Fact]
    public async Task Handle_throws_not_found_for_an_unknown_email()
    {
        FakeUserRepository repository = new(null);
        ForgotPasswordCommandHandler handler = new(repository, new StubJwtService());

        NotFoundException exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            handler.Handle(new ForgotPasswordCommand("missing@cosmara.dev"), CancellationToken.None));

        Assert.Equal("No account is registered with that email.", exception.Message);
        Assert.Null(repository.UpdatedUser);
    }
}
