/**
 * Central error handling utilities
 */

/**
 * Handles errors by throwing a new Error with a message
 * @param error - The error to handle
 * @throws Throws a new error with the provided message or a default message
 */
export function errorHandler(error: unknown): never {
    if (error instanceof Error) {
        throw new Error(error.message);
    }

    throw new Error(String(error));
}
