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
        const monitorMappings = this.getMonitorMappings();

        for (const monitorMapping of monitorMappings) {
            if (monitorMapping.gdkIndex === monitor) {
                return monitorMapping.hyprlandId;
            }
        }
    }

    /**
     * Converts a Hyprland monitor id to the corresponding GDK monitor id.
     *
     * @param monitor - The Hyprland monitor id.
     * @returns The corresponding GDK monitor id.
     */
    public mapHyprlandToGdk(monitor: number): number {
        const monitorMappings = this.getMonitorMappings();

        for (var monitorMapping of monitorMappings) {
            if (monitorMapping.hyprlandId === monitor) {
                return monitorMapping.gdkIndex;
            }
        }
    }

    public getMonitorMappings(): MonitorMapping[] {
        const display = Gdk.Display.get_default();
        const monitorCount = display.get_n_monitors();

        const x : IHash = {};

        for (let gdkMonitorIndex = 0; gdkMonitorIndex < monitorCount; gdkMonitorIndex++) {
            const monitor = display.get_monitor(gdkMonitorIndex);
            if (monitor === null) {
                console.warn(`[forMonitors] Skipping invalid monitor at index ${gdkMonitorIndex}`);
                continue;
            }
            x[monitor] = gdkMonitorIndex;
        }

        const monitorMappings: MonitorMapping[] = [];

        const hyprlandMonitors = hyprlandService.get_monitors();
        for (let i = 0; i < monitorCount; i++) {
            const gdkMonitor = display.get_monitor_at_point(hyprlandMonitors[i].x, hyprlandMonitors[i].y);
            monitorMappings.push({
                gdkIndex: x[gdkMonitor],
                hyprlandId: hyprlandMonitors[i].id,
            });
        }

        // console.log("monitorMappings ", monitorMappings);

        return monitorMappings;
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
        if (!hyprlandMonitor.model || hyprlandMonitor.model === 'null') {
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
