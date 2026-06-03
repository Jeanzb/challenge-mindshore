# Implementation Plan

## Scope

Build a fullstack NASA Explorer platform with a React frontend, .NET Core backend, SQL Server 2022, Docker Compose, authentication, user-scoped collections, NASA image search, and OpenAI-powered enrichment.

## Core Features

- Advanced NASA image search with keyword, date, rover, camera, mission, and pagination filters.
- JWT authentication with register, login, refresh token, and user-scoped resources.
- Multiple personalized collections per user with saved NASA images.
- AI enrichment for image descriptions, fun facts, historical context, comparison, and suggested tags.

## Differentiators

- Image comparator with AI-generated comparative analysis.
- Export collection to PDF.
- Tag system with manual tags and AI suggestions.

## API Strategy

NASA Image and Video Library is the primary source for image search. See `docs/nasa-api-strategy.md` for endpoint selection, filter mapping, and the decision not to depend on the archived Mars Rover API.

## Monorepo Layout

```text
/
  apps/
    backend/
      src/
      tests/
    frontend/
      src/
  docs/
```

- Backend solution and projects live under `apps/backend`.
- Frontend workspace lives under `apps/frontend`.
- Root-level Docker Compose coordinates SQL Server, backend, and frontend.

## Commit Plan

1. `chore: establish project baseline`
2. `chore: scaffold monorepo workspace`
3. `chore: scaffold .NET clean architecture solution`
4. `chore: add SQL Server docker compose setup`
5. `docs: define NASA API integration strategy`
6. `feat(domain): model users collections and image metadata`
7. `feat(infrastructure): configure EF Core persistence`
8. `feat(auth): implement JWT registration and login`
9. `feat(search): add NASA image search proxy`
10. `feat(collections): manage user collections`
11. `feat(ai): add OpenAI enrichment services`
12. `feat(export): generate collection PDF`
13. `chore(web): scaffold React frontend`
14. `feat(web-auth): add authentication screens`
15. `feat(web-search): add NASA search experience`
16. `feat(web-collections): add collection workflows`
17. `feat(web-ai): add enrichment comparison and tags`
18. `test: cover backend handlers and frontend components`
19. `docs: document setup architecture and tradeoffs`
