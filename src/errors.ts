export type ErrorDetails = Readonly<Record<string, unknown>>;

export class ChainBloomError extends Error {
  public readonly code: string;
  public readonly details: ErrorDetails | undefined;

  public constructor(code: string, message: string, details?: ErrorDetails) {
    super(message);
    this.name = 'ChainBloomError';
    this.code = code;
    this.details = details;
  }
}

export function asChainBloomError(error: unknown): ChainBloomError {
  if (error instanceof ChainBloomError) return error;
  if (error instanceof Error) {
    return new ChainBloomError('UNEXPECTED_ERROR', error.message, { name: error.name });
  }
  return new ChainBloomError('UNEXPECTED_ERROR', 'Unknown error', { error });
}
