FROM mcr.microsoft.com/dotnet/sdk:10.0 AS restore
WORKDIR /src

COPY global.json ./
COPY apps/backend/NasaExplorer.sln apps/backend/
COPY apps/backend/src/NasaExplorer.API/NasaExplorer.API.csproj apps/backend/src/NasaExplorer.API/
COPY apps/backend/src/NasaExplorer.Application/NasaExplorer.Application.csproj apps/backend/src/NasaExplorer.Application/
COPY apps/backend/src/NasaExplorer.Domain/NasaExplorer.Domain.csproj apps/backend/src/NasaExplorer.Domain/
COPY apps/backend/src/NasaExplorer.Infrastructure/NasaExplorer.Infrastructure.csproj apps/backend/src/NasaExplorer.Infrastructure/
COPY apps/backend/tests/NasaExplorer.Application.Tests/NasaExplorer.Application.Tests.csproj apps/backend/tests/NasaExplorer.Application.Tests/
COPY apps/backend/tests/NasaExplorer.Infrastructure.Tests/NasaExplorer.Infrastructure.Tests.csproj apps/backend/tests/NasaExplorer.Infrastructure.Tests/
RUN dotnet restore apps/backend/NasaExplorer.sln

FROM restore AS build
COPY apps/backend apps/backend
RUN dotnet publish apps/backend/src/NasaExplorer.API/NasaExplorer.API.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
RUN apk add --no-cache icu-libs \
    && addgroup -S nasaexplorer \
    && adduser -S nasaexplorer -G nasaexplorer
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
EXPOSE 8080
COPY --from=build --chown=nasaexplorer:nasaexplorer /app/publish .
USER nasaexplorer
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1
ENTRYPOINT ["dotnet", "NasaExplorer.API.dll"]
