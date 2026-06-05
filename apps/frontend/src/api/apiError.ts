export type ApiErrorDetails = Record<string, unknown> | string | null;

export class ApiError extends Error {
  public readonly status: number;

  public readonly details: ApiErrorDetails;

  public constructor(status: number, message: string, details: ApiErrorDetails = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
