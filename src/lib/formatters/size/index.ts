import { Postfix } from './types';

/**
 * Formats a size in bytes to KiB.
 *
 * This function converts a size in bytes to kibibytes (KiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in KiB as a number.
 */
export function formatSizeInKiB(sizeInBytes: number, round: boolean): number {
    const sizeInGiB = sizeInBytes / 1024 ** 1;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
}

/**
 * Formats a size in bytes to MiB.
 *
 * This function converts a size in bytes to mebibytes (MiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in MiB as a number.
 */
export function formatSizeInMiB(sizeInBytes: number, round: boolean): number {
    const sizeInGiB = sizeInBytes / 1024 ** 2;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
}

/**
 * Formats a size in bytes to GiB.
 *
 * This function converts a size in bytes to gibibytes (GiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in GiB as a number.
 */
export function formatSizeInGiB(sizeInBytes: number, round: boolean): number {
    const sizeInGiB = sizeInBytes / 1024 ** 3;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
}

/**
 * Formats a size in bytes to TiB.
 *
 * This function converts a size in bytes to tebibytes (TiB) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The size in TiB as a number.
 */
export function formatSizeInTiB(sizeInBytes: number, round: boolean): number {
    const sizeInGiB = sizeInBytes / 1024 ** 4;
    return round ? Math.round(sizeInGiB) : parseFloat(sizeInGiB.toFixed(2));
}

/**
 * Automatically formats a size in bytes to the appropriate unit.
 *
 * This function converts a size in bytes to the most appropriate unit (TiB, GiB, MiB, KiB, or bytes) and optionally rounds the result.
 *
 * @param sizeInBytes The size in bytes to format.
 * @param round A boolean indicating whether to round the result.
 *
 * @returns The formatted size as a number.
 */
export function autoFormatSize(sizeInBytes: number, round: boolean): number {
    if (sizeInBytes >= 1024 ** 4) return formatSizeInTiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 3) return formatSizeInGiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 2) return formatSizeInMiB(sizeInBytes, round);
    if (sizeInBytes >= 1024 ** 1) return formatSizeInKiB(sizeInBytes, round);

    return sizeInBytes;
}

/**
 * Retrieves the appropriate postfix for a size in bytes.
 *
 * This function returns the appropriate postfix (TiB, GiB, MiB, KiB, or B) for a given size in bytes.
 *
 * @param sizeInBytes The size in bytes to determine the postfix for.
 *
 * @returns The postfix as a string.
 */
export function getPostfix(sizeInBytes: number): Postfix {
    if (sizeInBytes >= 1024 ** 4) return Postfix.TEBIBYTE;
    if (sizeInBytes >= 1024 ** 3) return Postfix.GIBIBYTE;
    if (sizeInBytes >= 1024 ** 2) return Postfix.MEBIBYTE;
    if (sizeInBytes >= 1024 ** 1) return Postfix.KIBIBYTE;

    return Postfix.BYTE;
}
