# Cosmara — Explorador Espacial de NASA con IA

## ¿Qué construí?

Una aplicación fullstack que conecta con la API de la NASA para **explorar imágenes espaciales**, organizarlas en **colecciones personalizadas**, y **enriquecerlas con IA generativa** (descripciones, contexto histórico y comparaciones).

La exploración de imágenes es pública. Las funciones que modifican datos del usuario o consumen IA requieren autenticación.

## Stack tecnológico

### Frontend
- **React** — librería principal para construir la interfaz.
- **React DOM** — renderizado de la aplicación React en el navegador.
- **TypeScript** — tipado estático para mejorar mantenibilidad y reducir errores.
- **Vite** — herramienta de desarrollo y build del frontend.
- **Bun** — gestor de paquetes y runtime usado para instalar dependencias y ejecutar scripts.
- **TanStack Router** — manejo de rutas del lado del cliente.
- **TanStack Query** — gestión de datos remotos, caché de requests, estados de carga y errores.
- **Zustand** — estado global liviano para preferencias y estado compartido de UI.
- **React Hook Form** — manejo eficiente de formularios.
- **Zod** — validación de esquemas y datos.
- **Tailwind CSS** — estilos utilitarios y responsive design.
- **shadcn/ui** — componentes reutilizables construidos sobre Radix UI y Tailwind CSS.
- **Sonner** — notificaciones tipo toast para feedback de acciones del usuario.
- **Paraglide JS** — internacionalización de la aplicación en español e inglés.
- **Cypress** — pruebas de componentes y pruebas end-to-end.

### Backend
- **.NET 10**
- **ASP.NET Core**
- **Clean Architecture**
- **CQRS con MediatR**
- **Entity Framework Core**
- **SQL Server**
- **Redis**
- **JWT Bearer Authentication**
- **FluentValidation**
- **BCrypt**
- **AspNetCoreRateLimit**
- **xUnit**

### Servicios externos
- **NASA Image and Video Library API** — fuente principal de imágenes y metadatos espaciales.
- **Gemini 2.5 Flash** — proveedor de IA por defecto mediante cliente compatible con OpenAI.
- **Redis** — caché backend para reducir llamadas repetidas a servicios externos.

### DevOps
- **Docker Compose** — levantamiento completo de frontend, backend, base de datos y Redis.
- **Nginx** — servidor web para servir el build de React/Vite.
- **SQL Server Container** — base de datos relacional en entorno local/containerizado.
- **Redis Container** — servicio de caché para el backend.
- **Variables de entorno** — configuración segura mediante `.env` y `.env.example`.

## Diferenciadores elegidos (3)

- **Comparador de imágenes** — El usuario selecciona varias imágenes de sus colecciones y la IA genera un análisis comparativo estructurado en similitudes, diferencias, contexto histórico y valor científico, en el idioma activo (es/en).
- **Timeline interactiva** — Las imágenes con fecha de captura se ordenan cronológicamente en una línea de tiempo horizontal navegable, con rangos y vista compacta/expandida.
- **Búsqueda semántica** — El usuario escribe una frase en lenguaje natural y la IA la reformula en una consulta optimizada que se ejecuta contra la API de NASA. Si la IA no está disponible, la búsqueda sigue funcionando con la consulta original.

## Decisiones técnicas

- **Clean Architecture + CQRS (MediatR)** en el backend — separo Domain / Application / Infrastructure / API; cada caso de uso es un command/query con su handler y validador (FluentValidation). Agrega algo de boilerplate, pero mantiene los controllers delgados y la lógica testeable de forma aislada.
- **Aislamiento por usuario a nivel de repositorio** — todo acceso a datos filtra por `UserId`, de modo que un usuario nunca puede leer colecciones de otro. Es la regla de seguridad central y está cubierta con tests de autorización cross-user.
- **Caché de NASA con Redis vía patrón Decorator** — `CachedNasaApiService` envuelve al servicio real contra la abstracción `IDistributedCache`. En producción usa Redis; si no hay conexión cae a caché en memoria, sin tocar el código. Si Redis falla, se degrada a un cache miss en lugar de romper la petición.
- **IA con fallback determinístico** — cliente compatible-OpenAI apuntando por defecto a **Gemini (`gemini-2.5-flash`)**; cambiar de proveedor es solo variables de entorno. Sin clave de API, los servicios devuelven respuestas determinísticas basadas en metadatos de NASA, así la app y los tests funcionan sin créditos ni dependencias externas.
- **Soft-delete con query filters de EF Core** — las colecciones eliminadas desaparecen de forma transparente de todas las consultas.
- **SQL Server + EF Core** — por integración nativa con .NET; las migraciones se aplican automáticamente al arrancar la API (sin pasos manuales de DB).
- **i18n con Paraglide JS** — español e inglés compilados en funciones ESM tipadas y tree-shakable durante el build de Vite.
- **Rate limiting** (`AspNetCoreRateLimit`) en los endpoints que llaman a servicios externos.

## Seguridad

- Las claves de NASA, IA y JWT viven solo en el backend; nunca se exponen al frontend.
- Contraseñas hasheadas con **BCrypt**; endpoints protegidos con **JWT Bearer**.
- Inputs validados con FluentValidation en cada command/query.
- Colecciones aisladas por usuario (`WHERE UserId == userId`).
- Errores internos y stack traces no se exponen al cliente.
- `.env` y artefactos generados excluidos del repo; se incluye `.env.example`.

> Para simplificar la entrega, el JWT se persiste en `localStorage` y se envía vía `Authorization: Bearer`. En producción migraría a cookies `HttpOnly`/`Secure`/`SameSite` con protección CSRF.

## Manejo de errores y estados de UI

Skeletons durante la carga, estados vacíos (búsqueda, colecciones, comparador, timeline), mensajes de error amigables vía toasts, tratamiento específico de los límites de la API de NASA, y feedback durante operaciones de IA, guardado y autenticación.

## Cómo ejecutar

**Docker Compose (todo en uno)** — levanta SQL Server, Redis, API y frontend:

```bash
cp .env.example .env   # NASA_API_KEY y AI_API_KEY son opcionales
docker compose up --build
```
- Frontend: http://localhost:8080 · API: http://localhost:5000 (`/health`)

**Local (desarrollo):**

```bash
# Backend (requiere SQL Server; Redis opcional)
dotnet run --project apps/backend/src/NasaExplorer.API

# Frontend
cd apps/frontend && bun install && bun run dev
```

## Testing

```bash
dotnet test apps/backend/NasaExplorer.sln   # xUnit: dominio, validadores, handlers, repos, caché
cd apps/frontend && bun run test            # Cypress component testing
bun run test:e2e                            # Cypress end-to-end
```

Cobertura destacada: invariantes de dominio, validación de comandos, **autorización cross-user a nivel de repositorio** y el comportamiento de caché del `CachedNasaApiService`.

## Deploy funcional

Cosmara está desplegado en **Azure Container Apps**, con la base de datos en **Azure SQL Database** (región Canada Central). El backend y el frontend corren como contenedores independientes a partir del mismo monorepo.

- **Aplicación (frontend):** https://cosmara-frontend.jollybay-0ed2603a.canadacentral.azurecontainerapps.io
- **API (backend):** https://cosmara-api.jollybay-0ed2603a.canadacentral.azurecontainerapps.io
- **Health checks:** `/health` en ambos servicios.

Detalles de la infraestructura:

- **Frontend** — contenedor estático de React/Vite servido por **Nginx**, con `VITE_API_BASE_URL` apuntando a la URL pública del backend.
- **Backend** — contenedor de **ASP.NET Core** que aplica automáticamente las migraciones de **EF Core** contra Azure SQL al arrancar.
- **Base de datos** — **Azure SQL Database** (`CosmaraDb`), con acceso de red restringido al runtime de la app.
- **Secrets** (`Jwt__Secret`, `NASA_API_KEY`, `AI_API_KEY`, credenciales de Azure SQL) se inyectan como variables de entorno del contenedor, nunca en el repositorio.

> El contenedor puede escalar a cero por inactividad; la primera carga tras un rato sin uso puede tardar unos segundos.

## ¿Qué mejoraría con más tiempo?

- **Conectar el export a PDF a la UI** — el backend (endpoint, handler y servicio de generación de PDF) ya está implementado; faltaría cablear el componente en el frontend.
- **Más cobertura de tests** — tests de integración de la API end-to-end y más component tests en el frontend.
- **Paginación en colecciones grandes** — hoy se cargan todas las imágenes de una colección de una vez.
- **Optimistic UI** — las operaciones sobre colecciones esperan la respuesta del servidor en lugar de actualizar de inmediato y revertir ante error.
- **Recuperación de contraseña real** — hoy no hay flujo de email (no integré una librería de mensajería).

## Cosas a saber antes de revisar

- **Funciona sin claves.** NASA expone endpoints públicos y la IA cae a su fallback determinístico, así que la app corre sin `NASA_API_KEY` ni `AI_API_KEY`.
- **Proveedor de IA por defecto: Gemini** (`gemini-2.5-flash`) vía endpoint compatible-OpenAI. Migrar a OpenAI u otro es cambiar `AI_BASE_URL`, `AI_MODEL` y `AI_API_KEY` en `.env`.
- **Migraciones automáticas.** La API aplica las migraciones de EF Core al arrancar; no hay que correr nada manual sobre la base.
- **Sin usuario de demo / seed.** Hay que registrarse para usar las funciones autenticadas (colecciones, IA).
