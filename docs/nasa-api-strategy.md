# NASA API Integration Strategy

## Decision

The application will use NASA Image and Video Library as the primary image source.

- API root: `https://images-api.nasa.gov`
- Documentation: `https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf`
- Primary endpoints:
  - `GET /search`
  - `GET /asset/{nasa_id}`
  - `GET /metadata/{nasa_id}`

NASA documents the Mars Rover API as archived, and a local validation call to the legacy rover endpoint returned `404` on 2026-06-03. The application will not depend on that archived endpoint.

## Search Mapping

NASA Image and Video Library exposes broad metadata search, but it does not expose structured rover, camera, or mission fields. Those filters will be implemented as best-effort search constraints over available metadata.

| App filter | NASA Image API mapping |
| --- | --- |
| `q` | `q` |
| `dateFrom` | `year_start`, plus backend filtering by `date_created` when a full date is provided |
| `dateTo` | `year_end`, plus backend filtering by `date_created` when a full date is provided |
| `rover` | additional search term in `q` and/or `keywords` |
| `camera` | additional search term in `q` and/or `description` |
| `mission` | additional search term in `q` and/or `keywords` |
| `page` | `page` |
| `pageSize` | `page_size` |

## Response Mapping

Search results are returned as Collection+JSON.

- `collection.metadata.total_hits` maps to the total result count.
- `collection.items[].data[0].nasa_id` maps to `NasaImageId`.
- `collection.items[].data[0].title` maps to `Title`.
- `collection.items[].data[0].description` maps to `Description`.
- `collection.items[].data[0].date_created` maps to `DateCreated`.
- `collection.items[].data[0].keywords` maps to `Keywords`.
- `collection.items[].links[]` provides available image variants.

Image URL selection should prefer usable web image variants in this order:

1. `~large`
2. `~medium`
3. `~small`
4. `~thumb`
5. first image link available

The thumbnail URL should prefer `rel=preview`, then `~thumb`, then the selected image URL.

## API Key Handling

NASA Image and Video Library documentation does not require authentication for the documented endpoints. The backend will still keep `NasaApiOptions.ApiKey` in configuration so the project can support NASA endpoints that use `api.nasa.gov` keys, and so credentials remain externalized.

The API key must never be committed. Local values belong in `.env`, user secrets, or deployment environment variables.

## Product Implications

The UI should label rover, camera, and mission filtering as advanced search filters, but the backend contract should document that these filters are metadata-based and may not behave like exact database fields.

This trade-off is acceptable for the challenge because it keeps the implementation on a live official NASA API while still supporting the requested discovery workflow.
