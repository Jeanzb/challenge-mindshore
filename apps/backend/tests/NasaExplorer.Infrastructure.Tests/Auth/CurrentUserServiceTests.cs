using Microsoft.AspNetCore.Http;
using NasaExplorer.Application.Common.Exceptions;
using NasaExplorer.Infrastructure.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace NasaExplorer.Infrastructure.Tests.Auth;

public sealed class CurrentUserServiceTests
{
    [Fact]
    public void UserId_returns_name_identifier_claim()
    {
        Guid userId = Guid.NewGuid();
        CurrentUserService service = CreateService(new Claim(ClaimTypes.NameIdentifier, userId.ToString()));

        Assert.True(service.IsAuthenticated);
        Assert.Equal(userId, service.UserId);
        Assert.Equal(userId, service.GetRequiredUserId());
    }

    [Fact]
    public void UserId_uses_subject_claim_when_name_identifier_is_missing()
    {
        Guid userId = Guid.NewGuid();
        CurrentUserService service = CreateService(new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()));

        Assert.Equal(userId, service.UserId);
    }

    [Fact]
    public void UserId_returns_null_when_claim_is_invalid()
    {
        CurrentUserService service = CreateService(new Claim(ClaimTypes.NameIdentifier, "invalid"));

        Assert.Null(service.UserId);
    }

    [Fact]
    public void GetRequiredUserId_throws_when_user_id_is_missing()
    {
        CurrentUserService service = new(new HttpContextAccessor
        {
            HttpContext = new DefaultHttpContext()
        });

        UnauthorizedException exception = Assert.Throws<UnauthorizedException>(() => service.GetRequiredUserId());

        Assert.Equal("Authenticated user id is required.", exception.Message);
    }

    private static CurrentUserService CreateService(Claim claim)
    {
        ClaimsIdentity identity = new([claim], "TestAuth");
        DefaultHttpContext context = new()
        {
            User = new ClaimsPrincipal(identity)
        };

        return new CurrentUserService(new HttpContextAccessor
        {
            HttpContext = context
        });
    }
}
