import { GLib } from 'astal';
import Soup from 'gi://Soup?version=3.0';
import { HttpError } from './HttpError';
import { RequestOptions, RestResponse } from './types';
import { errorHandler } from 'src/core/errors/handler';

/**
 * HTTP client wrapper for Soup.Session providing a Promise-based API
 * Handles authentication, timeouts, and JSON parsing automatically
 */
class HttpClient {
    private _session: Soup.Session;
    constructor(defaultTimeout = 30) {
        this._session = new Soup.Session();
        this._session.timeout = defaultTimeout;
        this._session.user_agent = 'HyprPanel/1.0';
    }

    /*******************************************
     *              HTTP Methods               *
     *******************************************/

    /**
     * Performs an HTTP GET request
     * @param url - Target URL for the request
     * @param options - Optional configuration for the request
     */
    public async get(url: string, options?: RequestOptions): Promise<RestResponse> {
        return this._request('GET', url, options);
    }

    /**
     * Performs an HTTP POST request
     * @param url - Target URL for the request
     * @param data - Request payload to send
     * @param options - Optional configuration for the request
     */
    public async post(
        url: string,
        data?: Record<string, unknown>,
        options?: RequestOptions,
    ): Promise<RestResponse> {
        return this._request('POST', url, { ...options, body: data });
    }

    /**
     * Performs an HTTP PUT request
     * @param url - Target URL for the request
     * @param data - Request payload to send
     * @param options - Optional configuration for the request
     */
    public async put(
        url: string,
        data?: Record<string, unknown>,
        options?: RequestOptions,
    ): Promise<RestResponse> {
        return this._request('PUT', url, { ...options, body: data });
    }

    /**
     * Performs an HTTP PATCH request
     * @param url - Target URL for the request
     * @param data - Request payload with partial updates
     * @param options - Optional configuration for the request
     */
    public async patch(
        url: string,
        data?: Record<string, unknown>,
        options?: RequestOptions,
    ): Promise<RestResponse> {
        return this._request('PATCH', url, { ...options, body: data });
    }

    /**
     * Performs an HTTP DELETE request
     * @param url - Target URL for the request
     * @param options - Optional configuration for the request
     */
    public async delete(url: string, options?: RequestOptions): Promise<RestResponse> {
        return this._request('DELETE', url, options);
    }

    /*******************************************
     *           SOUP Infrastructure           *
     *******************************************/

    /**
     * Internal request handler for all HTTP methods
     * @param method - HTTP method to use
     * @param url - Target URL for the request
     * @param options - Configuration options for the request
     * @private
     */
    private async _request(method: string, url: string, options: RequestOptions = {}): Promise<RestResponse> {
        const requestPromise = new Promise<RestResponse>((resolve, reject) => {
            const message = Soup.Message.new(method, url);

            if (!message) {
                return reject(new Error(`Failed to create request for ${url}`));
            }

            this._assignHeaders(message, options);
            this._constructBodyIfExists(method, options, message);

            if (options.timeout) {
                this._session.timeout = options.timeout / 1000;
            }

            this._sendRequest(resolve, reject, message, options);
        });

        return requestPromise;
    }

    /**
     * Constructs and sets the request body for HTTP methods that support it
     * @param method - HTTP method being used
     * @param options - Request options containing the body
     * @param message - Soup message to attach the body to
     */
    private _constructBodyIfExists(method: string, options: RequestOptions, message: Soup.Message): void {
        const canContainBody = ['POST', 'PUT', 'PATCH'].includes(method);
        if (options.body && canContainBody) {
            let body: string;
            let contentType = options.headers?.['Content-Type'] || 'application/json';

            if (typeof options.body === 'object') {
                body = JSON.stringify(options.body);
            } else {
                body = options.body;
                contentType = contentType || 'text/plain';
            }

            const textEncoder = new TextEncoder();
            const bytes = new GLib.Bytes(textEncoder.encode(body));
            message.set_request_body_from_bytes(contentType, bytes);
        }
    }

    /**
     * Assigns headers to the request message
     * @param message - Soup message to add headers to
     * @param options - Request options containing headers
     */
    private _assignHeaders(message: Soup.Message, options: RequestOptions): Soup.MessageHeaders {
        const headers = message.get_request_headers();

        if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                headers.append(key, value);
            });
        }

        return headers;
    }

    /**
     * Sends the HTTP request and handles the response
     * @param resolve - Promise resolve callback
     * @param reject - Promise reject callback
     * @param message - Prepared Soup message to send
     * @param options - Request configuration options
     */
    private async _sendRequest(
        resolve: (value: RestResponse | PromiseLike<RestResponse>) => void,
        reject: (reason?: unknown) => void,
        message: Soup.Message,
        options: RequestOptions,
    ): Promise<void> {
        const cancellable = options.signal ?? null;

        try {
            const bytes = await new Promise<GLib.Bytes | null>((resolveAsync, rejectAsync) => {
                this._session.send_and_read_async(
                    message,
                    GLib.PRIORITY_DEFAULT,
                    cancellable,
                    (_, result) => {
                        try {
                            const bytes = this._session.send_and_read_finish(result);
                            resolveAsync(bytes);
                        } catch (error) {
                            rejectAsync(error);
                        }
                    },
                );
            });

            const {
                response: responseText,
                headers: responseHeaders,
                status,
            } = this._decodeResponseSync(message, bytes);

            const responseData = this._parseReponseData(options, responseText);

            const response: RestResponse = {
                data: responseData,
                status,
                headers: responseHeaders,
            };

            if (status >= 400) {
                const httpError = new HttpError({
                    status,
                    data: responseData,
                    url: message.get_uri().to_string(),
                    method: message.get_method(),
                });

                return reject(httpError);
            }

            return resolve(response);
        } catch (error) {
            reject(error);
        }
    }

    /**
     * Decodes the response bytes into text and extracts response metadata
     * @param message - Soup message containing the response
     * @param bytes - Response bytes from the sync request
     */
    private _decodeResponseSync(
        message: Soup.Message,
        bytes: GLib.Bytes | null,
    ): {
        response: string;
        status: Soup.Status;
        headers: Record<string, string>;
    } {
        if (!bytes) {
            throw new Error('No response received');
        }

        const decoder = new TextDecoder();
        const byteData = bytes.get_data();

        const responseText = byteData ? decoder.decode(byteData) : '';
        const status = message.get_status();

        const responseHeaders: Record<string, string> = {};

        message.get_response_headers().foreach((name, value) => {
            responseHeaders[name] = value;
        });

        return {
            response: responseText,
            status,
            headers: responseHeaders,
        };
    }

    /**
     * Parses response text based on the expected response type
     * @param options - Request options containing responseType preference
     * @param responseText - Raw response text to parse
     */
    private _parseReponseData(
        options: RequestOptions,
        responseText: string,
    ): string | Record<string, unknown> {
        if (!responseText) {
            return '';
        }

        if (options.responseType === 'text') {
            return responseText;
        }

        try {
            const parsedResponseText = JSON.parse(responseText);
            return parsedResponseText;
        } catch (e) {
            errorHandler(`Failed to parse JSON response: ${e}`);
        }
    }
}

export const httpClient = new HttpClient();
