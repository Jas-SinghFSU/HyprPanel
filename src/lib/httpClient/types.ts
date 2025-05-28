import { Gio } from 'astal';

export interface RequestOptions {
    headers?: Record<string, string>;
    body?: string | object;
    timeout?: number;
    responseType?: 'json' | 'text';
    signal?: Gio.Cancellable;
}

export interface RestResponse {
    data: unknown;
    status: number;
    headers: Record<string, string>;
}

export interface HttpErrorOptions {
    status: number;
    message?: string;
    data?: unknown;
    url?: string;
    method?: string;
}
