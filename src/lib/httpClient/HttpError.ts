import { HttpErrorOptions } from './types';

/**
 * Custom error class for HTTP request failures
 * Provides status code and response data for error handling
 */
export class HttpError extends Error {
    public status: number;
    public data?: unknown;
    public url?: string;
    public method?: string;

    constructor(options: HttpErrorOptions) {
        const { status, message, data, url, method } = options;

        const errorMessage = message ? `: ${message}` : '';
        const response = `HTTP ${status}${errorMessage}`;

        super(response);
        this.name = 'HttpError';

        this.status = status;
        this.data = data;
        this.url = url;
        this.method = method;
    }
}
