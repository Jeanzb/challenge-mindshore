using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Application.Features.Auth.Commands.ResetPassword;
using NasaExplorer.Application.Tests.Features.Auth;
using NasaExplorer.Domain.Entities.Users;

namespace NasaExplorer.Application.Tests.Features.Auth.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandlerTests
{
    private static ResetPasswordCommandHandler CreateHandler(FakeUserRepository repository) =>
        new(repository, new StubJwtService(), new StubPasswordHashService());

    [Fact]
    public async Task Handle_resets_password_and_invalidates_tokens_for_a_valid_token()
    {
        User user = AuthTestData.CreateUser();
        user.SetRefreshToken("hash:existing-refresh", DateTimeOffset.UtcNow.AddDays(7));
        user.SetPasswordResetToken("hash:valid-token", DateTimeOffset.UtcNow.AddMinutes(10));
        FakeUserRepository repository = new(user);

        await CreateHandler(repository).Handle(
            new ResetPasswordCommand("valid-token", "BrandNew1"),
            CancellationToken.None);

        Assert.Equal("hashed:BrandNew1", user.PasswordHash);
        Assert.Null(user.PasswordResetTokenHash);
        Assert.Null(user.RefreshToken);
        Assert.Equal(user, repository.UpdatedUser);
    }

    [Fact]
    public async Task Handle_throws_unauthorized_for_an_unknown_token()
    {
        User user = AuthTestData.CreateUser();
        FakeUserRepository repository = new(user);

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            CreateHandler(repository).Handle(new ResetPasswordCommand("wrong-token", "BrandNew1"), CancellationToken.None));

        Assert.Equal("This password reset link is invalid.", exception.Message);
    }

    [Fact]
    public async Task Handle_throws_unauthorized_and_clears_token_when_expired()
    {
        User user = AuthTestData.CreateUser();
        user.SetPasswordResetToken("hash:expired-token", DateTimeOffset.UtcNow.AddMinutes(-1));
        FakeUserRepository repository = new(user);

        UnauthorizedException exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            CreateHandler(repository).Handle(new ResetPasswordCommand("expired-token", "BrandNew1"), CancellationToken.None));

        Assert.Equal("This password reset link has expired.", exception.Message);
        Assert.Null(user.PasswordResetTokenHash);
        Assert.Equal(user, repository.UpdatedUser);
    }
}
