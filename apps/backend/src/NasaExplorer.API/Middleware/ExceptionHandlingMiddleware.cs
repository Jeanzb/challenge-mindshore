using NasaExplorer.Application.Common.Exceptions;

namespace NasaExplorer.API.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException exception)
        {
            await WriteResponseAsync(context, StatusCodes.Status400BadRequest, new
            {
                message = exception.Message,
                errors = exception.Errors
            });
        }
        catch (UnauthorizedException exception)
        {
            await WriteResponseAsync(context, StatusCodes.Status403Forbidden, new
            {
                message = exception.Message
            });
        }
        catch (Exception)
        {
            await WriteResponseAsync(context, StatusCodes.Status500InternalServerError, new
            {
                message = "An unexpected error occurred."
            });
        }
    }

    private static async Task WriteResponseAsync(HttpContext context, int statusCode, object response)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(response);
    }
}
