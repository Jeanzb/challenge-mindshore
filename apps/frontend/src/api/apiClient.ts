import { ApiError, type ApiErrorDetails } from "@/api/apiError";
import { authTokenStorage } from "@/api/authTokenStorage";

type ApiQueryParamValue = string | number | boolean | Date | null | undefined;

export type ApiQueryParams = Record<string, ApiQueryParamValue | ApiQueryParamValue[]>;

type ApiResponseType = "json" | "blob" | "void";

type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  query?: ApiQueryParams;
  body?: unknown;
  authenticated?: boolean;
  responseType?: ApiResponseType;
};

type ApiMethodRequestOptions = Omit<ApiRequestOptions, "body">;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5207";

export class ApiClient {
  private readonly baseUrl: string;

  public constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  public get<TResponse>(path: string, options: ApiMethodRequestOptions = {}): Promise<TResponse> {
    return this.request<TResponse>(path, "GET", options);
  }

  public post<TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    options: ApiMethodRequestOptions = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(path, "POST", { ...options, body });
  }

  public put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: ApiMethodRequestOptions = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(path, "PUT", { ...options, body });
  }

  public delete<TResponse = void>(path: string, options: ApiMethodRequestOptions = {}): Promise<TResponse> {
    return this.request<TResponse>(path, "DELETE", options);
  }

  public postBlob<TBody = unknown>(
    path: string,
    body?: TBody,
    options: ApiMethodRequestOptions = {}
  ): Promise<Blob> {
    return this.request<Blob>(path, "POST", { ...options, body, responseType: "blob" });
  }

  private async request<TResponse>(
    path: string,
    method: string,
    options: ApiRequestOptions = {}
  ): Promise<TResponse> {
    const { body, query, authenticated, responseType, ...requestInit } = options;
    const headers = new Headers(options.headers);
    const token = authTokenStorage.getAccessToken();

    headers.set("Accept", "application/json");

    if (authenticated !== false && token !== null) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const init: RequestInit = {
      ...requestInit,
      method,
      headers
    };

    if (body !== undefined) {
      if (this.isBodyInit(body)) {
        init.body = body;
      } else {
        headers.set("Content-Type", "application/json");
        init.body = JSON.stringify(body);
      }
    }

    const response = await fetch(this.buildUrl(path, query), init);

    if (!response.ok) {
      const details = await this.parseErrorDetails(response);
      throw new ApiError(response.status, this.extractErrorMessage(details, response.statusText), details);
    }

    if (response.status === 204 || responseType === "void") {
      return undefined as TResponse;
    }

    if (responseType === "blob") {
      return (await response.blob()) as TResponse;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  }

  private buildUrl(path: string, query?: ApiQueryParams): string {
    const origin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`, origin);

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => this.appendQueryParam(url, key, item));
        return;
      }

      this.appendQueryParam(url, key, value);
    });

    return url.toString();
  }

  private appendQueryParam(url: URL, key: string, value: ApiQueryParamValue): void {
    if (value === null || value === undefined || value === "") {
      return;
    }

    url.searchParams.append(key, value instanceof Date ? value.toISOString() : String(value));
  }

  private isBodyInit(body: unknown): body is BodyInit {
    return (
      typeof body === "string" ||
      body instanceof Blob ||
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof ArrayBuffer
    );
  }

  private async parseErrorDetails(response: Response): Promise<ApiErrorDetails> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as ApiErrorDetails;
    }

    const text = await response.text();

    return text.length > 0 ? text : null;
  }

  private extractErrorMessage(details: ApiErrorDetails, fallback: string): string {
    if (typeof details === "string" && details.length > 0) {
      return details;
    }

    if (details !== null && typeof details === "object" && typeof details.message === "string") {
      return details.message;
    }

    if (details !== null && typeof details === "object" && typeof details.title === "string") {
      return details.title;
    }

    return fallback.length > 0 ? fallback : "Request failed";
  }
}

export const apiClient = new ApiClient(apiBaseUrl);
