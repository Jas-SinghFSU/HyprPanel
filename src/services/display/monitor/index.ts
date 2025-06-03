import { Gdk } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const hyprlandService = AstalHyprland.get_default();

/**
 * Singleton service that manages the conversion between GDK and Hyprland monitor IDs.
 * Maintains persistent state to ensure consistent monitor mappings across the application lifecycle.
 */
export class GdkMonitorService {
    private static _instance: GdkMonitorService;
    private _usedHyprlandIds: Set<number>;

    private constructor() {
        this._usedHyprlandIds = new Set();
    }

    /**
     * Gets the singleton instance of GdkMonitorService.
     * Creates the instance on first access and reuses it for all subsequent calls.
     *
     * @returns The singleton GdkMonitorService instance
     */
    public static getInstance(): GdkMonitorService {
        if (!GdkMonitorService._instance) {
            GdkMonitorService._instance = new GdkMonitorService();
        }
        return GdkMonitorService._instance;
    }

    /**
     * Resets the internal state for monitor mappings.
     * Note: With singleton pattern, this should only be called when monitor
     * configuration actually changes.
     */
    public reset(): void {
        this._usedHyprlandIds.clear();
    }

    /**
     * Converts a GDK monitor id to the corresponding Hyprland monitor id.
     *
     * @param monitor - The GDK monitor id.
     * @returns The corresponding Hyprland monitor id.
     */
    public mapGdkToHyprland(monitor: number): number {
        const gdkMonitors = this._getGdkMonitors();

        if (Object.keys(gdkMonitors).length === 0) {
            return monitor;
        }

        const gdkMonitor = gdkMonitors[monitor];
        if (!gdkMonitor) {
            return monitor;
        }

        const hyprlandMonitors = hyprlandService.get_monitors();
        const validMonitors = hyprlandMonitors.filter((m) => m.model && m.model !== 'null');
        const tempUsedIds = new Set<number>();
        const monitorsToUse = validMonitors.length > 0 ? validMonitors : hyprlandMonitors;

        const result = this._matchMonitor(
            monitorsToUse,
            gdkMonitor,
            monitor,
            (mon) => mon.id,
            (mon, gdkMon) => this._matchMonitorKey(mon, gdkMon),
            tempUsedIds,
        );

        return result;
    }

    /**
     * Converts a Hyprland monitor id to the corresponding GDK monitor id.
     *
     * @param monitor - The Hyprland monitor id.
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
        const foundHyprlandMonitor =
            hyprlandMonitors.find((mon) => mon.id === monitor) || hyprlandMonitors[0];

        const tempUsedIds = new Set<number>();

        return this._matchMonitor(
            gdkCandidates,
            foundHyprlandMonitor,
            monitor,
            (candidate) => candidate.id,
            (candidate, hyprlandMonitor) => this._matchMonitorKey(hyprlandMonitor, candidate.monitor),
            tempUsedIds,
        );
    }

    /**
     * Generic helper that finds the best matching candidate monitor based on:
     *  1. A direct match (candidate matches the source and has the same id as the target, and hasn't been used).
     *  2. A relaxed match (candidate matches the source, regardless of id, and hasn't been used).
     *  3. No fallback - return target to preserve intended mapping.
     *
     * @param candidates - Array of candidate monitors.
     * @param source - The source monitor object to match against.
     * @param target - The desired monitor id.
     * @param getId - Function to extract the id from a candidate.
     * @param compare - Function that determines if a candidate matches the source.
     * @param usedIds - Set of already used IDs for this mapping batch.
     * @returns The chosen monitor id.
     */
    private _matchMonitor<T, U>(
        candidates: T[],
        source: U,
        target: number,
        getId: (candidate: T) => number,
        compare: (candidate: T, source: U) => boolean,
        usedIds: Set<number>,
    ): number {
        const directMatch = candidates.find((candidate) => {
            const matches = compare(candidate, source);
            const id = getId(candidate);
            const isUsed = usedIds.has(id);
            return matches && id === target && !isUsed;
        });

        if (directMatch !== undefined) {
            const result = getId(directMatch);
            usedIds.add(result);
            return result;
        }

        const relaxedMatch = candidates.find((candidate) => {
            const matches = compare(candidate, source);
            const id = getId(candidate);
            const isUsed = usedIds.has(id);
            return matches && !isUsed;
        });

        if (relaxedMatch !== undefined) {
            const result = getId(relaxedMatch);
            usedIds.add(result);
            return result;
        }

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
        if (
            !hyprlandMonitor?.model ||
            hyprlandMonitor.model === null ||
            hyprlandMonitor.model === undefined
        ) {
            return false;
        }

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

            try {
                const model = curMonitor.get_model() ?? '';
                const geometry = curMonitor.get_geometry();
                const scaleFactor = curMonitor.get_scale_factor();

                const key = `${model}_${geometry.width}x${geometry.height}_${scaleFactor}`;
                gdkMonitors[i] = { key, model, used: false };
            } catch (error) {
                console.warn(`Failed to get properties for monitor ${i}:`, error);
                gdkMonitors[i] = { key: `monitor_${i}`, model: 'Unknown', used: false };
            }
        }

        return gdkMonitors;
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
