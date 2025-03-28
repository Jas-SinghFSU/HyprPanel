import { Gdk } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const hyprlandService = AstalHyprland.get_default();

/**
 * The MonitorMapper class encapsulates the conversion logic between GDK and Hyprland monitor IDs.
 * It maintains internal state for monitors that have already been used so that duplicate assignments are avoided.
 */
export class GdkMonitorMapper {
    private usedGdkMonitors: Set<number>;
    private usedHyprlandMonitors: Set<number>;

    constructor() {
        this.usedGdkMonitors = new Set();
        this.usedHyprlandMonitors = new Set();
    }

    /**
     * Resets the internal state for both GDK and Hyprland monitor mappings.
     */
    public reset(): void {
        this.usedGdkMonitors.clear();
        this.usedHyprlandMonitors.clear();
    }

    /**
     * Converts a GDK monitor id to the corresponding Hyprland monitor id.
     *
     * @param monitor The GDK monitor id.
     * @returns The corresponding Hyprland monitor id.
     */
    public mapGdkToHyprland(monitor: number): number {
        const gdkMonitors = this._getGdkMonitors();

        if (Object.keys(gdkMonitors).length === 0) {
            return monitor;
        }

        const gdkMonitor = gdkMonitors[monitor];
        const hyprlandMonitors = hyprlandService.get_monitors();

        return this._matchMonitor(
            hyprlandMonitors,
            gdkMonitor,
            monitor,
            this.usedHyprlandMonitors,
            (mon) => mon.id,
            (mon, gdkMon) => this._matchMonitorKey(mon, gdkMon),
        );
    }

    /**
     * Converts a Hyprland monitor id to the corresponding GDK monitor id.
     *
     * @param monitor The Hyprland monitor id.
     * @returns The corresponding GDK monitor id.
     */
    public mapHyprlandToGdk(monitor: number): number {
        const gdkMonitors = this._getGdkMonitors();
        const gdkCandidates = Object.entries(gdkMonitors).map(([monitorId, monitorMetadata]) => ({
            id: Number(monitorId),
            monitor: monitorMetadata,
        }));

        if (gdkCandidates.length === 0) {
            return monitor;
        }

        const hyprlandMonitors = hyprlandService.get_monitors();
        const foundHyprlandMonitor = hyprlandMonitors.find((mon) => mon.id === monitor) || hyprlandMonitors[0];

        return this._matchMonitor(
            gdkCandidates,
            foundHyprlandMonitor,
            monitor,
            this.usedGdkMonitors,
            (candidate) => candidate.id,
            (candidate, hyprlandMonitor) => this._matchMonitorKey(hyprlandMonitor, candidate.monitor),
        );
    }

    /**
     * Generic helper that finds the best matching candidate monitor based on:
     *  1. A direct match (candidate matches the source and has the same id as the target).
     *  2. A relaxed match (candidate matches the source, regardless of id).
     *  3. A fallback match (first candidate that hasn’t been used).
     *
     * @param candidates Array of candidate monitors.
     * @param source The source monitor object to match against.
     * @param target The desired monitor id.
     * @param usedMonitors A Set of already used candidate ids.
     * @param getId Function to extract the id from a candidate.
     * @param compare Function that determines if a candidate matches the source.
     * @returns The chosen monitor id.
     */
    private _matchMonitor<T, U>(
        candidates: T[],
        source: U,
        target: number,
        usedMonitors: Set<number>,
        getId: (candidate: T) => number,
        compare: (candidate: T, source: U) => boolean,
    ): number {
        // Direct match: candidate matches the source and has the same id as the target.
        const directMatch = candidates.find(
            (candidate) =>
                compare(candidate, source) && !usedMonitors.has(getId(candidate)) && getId(candidate) === target,
        );

        if (directMatch !== undefined) {
            usedMonitors.add(getId(directMatch));
            return getId(directMatch);
        }

        // Relaxed match: candidate matches the source regardless of id.
        const relaxedMatch = candidates.find(
            (candidate) => compare(candidate, source) && !usedMonitors.has(getId(candidate)),
        );

        if (relaxedMatch !== undefined) {
            usedMonitors.add(getId(relaxedMatch));
            return getId(relaxedMatch);
        }

        // Fallback: use the first candidate that hasn't been used.
        const fallback = candidates.find((candidate) => !usedMonitors.has(getId(candidate)));

        if (fallback !== undefined) {
            usedMonitors.add(getId(fallback));
            return getId(fallback);
        }

        // As a last resort, iterate over candidate indices.
        for (let i = 0; i < candidates.length; i++) {
            if (!usedMonitors.has(i)) {
                usedMonitors.add(i);
                return i;
            }
        }

        console.warn(`Returning original monitor index as a last resort: ${target}`);
        return target;
    }

    /**
     * Determines if a Hyprland monitor matches a GDK monitor by comparing their keys
     *
     * @param hyprlandMonitor - Hyprland monitor object
     * @param gdkMonitor - GDK monitor object
     * @returns boolean indicating if the monitors match
     */
    private _matchMonitorKey(hyprlandMonitor: AstalHyprland.Monitor, gdkMonitor: GdkMonitor): boolean {
        const isRotated90 = hyprlandMonitor.transform % 2 !== 0;
        const gdkScaleFactor = Math.ceil(hyprlandMonitor.scale);

        const scaleFactorWidth = Math.trunc(hyprlandMonitor.width / gdkScaleFactor);
        const scaleFactorHeight = Math.trunc(hyprlandMonitor.height / gdkScaleFactor);
        const gdkScaleFactorKey = `${hyprlandMonitor.model}_${scaleFactorWidth}x${scaleFactorHeight}_${gdkScaleFactor}`;

        const transWidth = isRotated90 ? hyprlandMonitor.height : hyprlandMonitor.width;
        const transHeight = isRotated90 ? hyprlandMonitor.width : hyprlandMonitor.height;
        const scaleWidth = Math.trunc(transWidth / hyprlandMonitor.scale);
        const scaleHeight = Math.trunc(transHeight / hyprlandMonitor.scale);
        const hyprlandScaleFactorKey = `${hyprlandMonitor.model}_${scaleWidth}x${scaleHeight}_${gdkScaleFactor}`;

        const keyMatch = gdkMonitor.key === gdkScaleFactorKey || gdkMonitor.key === hyprlandScaleFactorKey;

        this._logMonitorInfo(
            gdkMonitor,
            hyprlandMonitor,
            isRotated90,
            gdkScaleFactor,
            gdkScaleFactorKey,
            hyprlandScaleFactorKey,
            keyMatch,
        );

        return keyMatch;
    }

    /**
     * Retrieves all GDK monitors from the default display
     *
     * @returns Object containing GDK monitor information indexed by monitor ID
     */
    private _getGdkMonitors(): GdkMonitors {
        const display = Gdk.Display.get_default();
        if (display === null) {
            console.error('Failed to get Gdk display.');
            return {};
        }

        const numGdkMonitors = display.get_n_monitors();
        const gdkMonitors: GdkMonitors = {};

        for (let i = 0; i < numGdkMonitors; i++) {
            const curMonitor = display.get_monitor(i);
            if (curMonitor === null) {
                console.warn(`Monitor at index ${i} is null.`);
                continue;
            }

            const model = curMonitor.get_model() || '';
            const geometry = curMonitor.get_geometry();
            const scaleFactor = curMonitor.get_scale_factor();

            // GDK3 only supports integer scale factors
            const key = `${model}_${geometry.width}x${geometry.height}_${scaleFactor}`;
            gdkMonitors[i] = { key, model, used: false };
        }

        return gdkMonitors;
    }

    /**
     * Logs detailed monitor information for debugging purposes
     * @param gdkMonitor - GDK monitor object
     * @param hyprlandMonitor - Hyprland monitor information
     * @param isRotated90 - Whether the monitor is rotated 90 degrees
     * @param gdkScaleFactor - The GDK monitor's scale factor
     * @param gdkScaleFactorKey - Key used for scale factor matching
     * @param hyprlandScaleFactorKey - Key used for general scale matching
     * @param keyMatch - Whether the monitor keys match
     */
    private _logMonitorInfo(
        gdkMonitor: GdkMonitor,
        hyprlandMonitor: AstalHyprland.Monitor,
        isRotated90: boolean,
        gdkScaleFactor: number,
        gdkScaleFactorKey: string,
        hyprlandScaleFactorKey: string,
        keyMatch: boolean,
    ): void {
        console.debug('=== Monitor Matching Debug Info ===');
        console.debug('GDK Monitor');
        console.debug(`  Key: ${gdkMonitor.key}`);
        console.debug('Hyprland Monitor');
        console.debug(`  ID: ${hyprlandMonitor.id}`);
        console.debug(`  Model: ${hyprlandMonitor.model}`);
        console.debug(`  Resolution: ${hyprlandMonitor.width}x${hyprlandMonitor.height}`);
        console.debug(`  Scale: ${hyprlandMonitor.scale}`);
        console.debug(`  Transform: ${hyprlandMonitor.transform}`);
        console.debug('Calculated Values');
        console.debug(`  Rotation: ${isRotated90 ? '90°' : '0°'}`);
        console.debug(`  GDK Scale Factor: ${gdkScaleFactor}`);
        console.debug('Calculated Keys');
        console.debug(`  GDK Scale Factor Key: ${gdkScaleFactorKey}`);
        console.debug(`  Hyprland Scale Factor Key: ${hyprlandScaleFactorKey}`);
        console.debug('Match Result');
        console.debug(`  ${keyMatch ? '✅ Monitors Match' : '❌ No Match'}`);
        console.debug('===============================\n');
    }
}

type GdkMonitor = {
    key: string;
    model: string;
    used: boolean;
};

type GdkMonitors = {
    [key: string]: GdkMonitor;
};
