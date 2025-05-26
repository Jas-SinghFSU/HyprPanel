import { bind, Variable } from 'astal';
import GTop from 'gi://GTop';

import { FunctionPoller } from 'src/lib/poller/FunctionPoller';
import { GenericResourceData } from '../types';
import { StorageServiceCtor, MultiDriveStorageData, DriveStorageData } from './types';
import { unique } from 'src/lib/array/helpers';

/**
 * Monitors storage usage across multiple drives and provides real-time updates
 *
 * This service polls filesystem usage data for configured mount points and maintains
 * both individual drive statistics and aggregated totals. The data updates automatically
 * at the configured interval and supports dynamic path configuration.
 */
class StorageService {
    private _updateFrequency: Variable<number>;
    private _shouldRound: Variable<boolean>;
    private _storagePoller: FunctionPoller<MultiDriveStorageData, []>;
    private _pathsToMonitor: Variable<string[]>;
    private _isInitialized = false;

    private _storage = Variable<GenericResourceData>({ total: 0, used: 0, percentage: 0, free: 0 });
    private _statBreakdown = Variable<MultiDriveStorageData>({
        total: { total: 0, used: 0, percentage: 0, free: 0 },
        drives: [],
    });

    /**
     * Creates a new storage monitoring service
     * @param frequency - Optional polling frequency variable
     * @param round - Optional rounding preference variable
     * @param pathsToMonitor - Optional array of mount paths to monitor
     */
    constructor({ frequency, round, pathsToMonitor }: StorageServiceCtor) {
        this._updateFrequency = frequency ?? Variable(2000);
        this._shouldRound = round ?? Variable(false);

        this._pathsToMonitor = pathsToMonitor ?? Variable(['/']);
        this._pathsToMonitor.set(unique(this._pathsToMonitor.get()));

        this._storagePoller = new FunctionPoller<MultiDriveStorageData, []>(
            this._statBreakdown,
            [bind(this._updateFrequency), bind(this._pathsToMonitor), bind(this._shouldRound)],
            bind(this._updateFrequency),
            this._calculateMultiDriveUsage.bind(this),
        );
    }

    /**
     * Starts the storage monitoring poller and performs initial data collection
     */
    public initialize(): void {
        if (!this._isInitialized) {
            this._storagePoller.initialize();
            this._isInitialized = true;

            this._statBreakdown.subscribe(() => {
                this._storage.set(this._statBreakdown.get().total);
            });

            this.refresh();
        }
    }

    /**
     * Manually triggers a storage data update outside the polling cycle
     */
    public refresh(): void {
        const multiDriveData = this._calculateMultiDriveUsage();
        this._statBreakdown.set(multiDriveData);
        this._storage.set(multiDriveData.total);
    }

    /**
     * Gets storage data for a specific drive by path
     * @param path - The mount path of the drive
     */
    public getDriveInfo(path: string): DriveStorageData | undefined {
        const data = this._statBreakdown.get();
        return data.drives.find((drive) => drive.path === path);
    }

    /**
     * Stops the automatic polling without destroying the service
     */
    public stopPoller(): void {
        this._storagePoller.stop();
    }

    /**
     * Resumes automatic polling after it has been stopped
     */
    public startPoller(): void {
        this._storagePoller.start();
    }

    /**
     * Cleans up all resources and stops monitoring
     */
    public destroy(): void {
        this._storagePoller.stop();
        this._storage.drop();
        this._statBreakdown.drop();
        this._pathsToMonitor.drop();
        this._updateFrequency.drop();
    }

    /**
     * Gets the aggregated storage data across all monitored drives
     */
    public get storage(): Variable<GenericResourceData> {
        return this._storage;
    }

    /**
     * Gets the detailed multi-drive storage data including individual drives
     */
    public get statBreakdown(): Variable<MultiDriveStorageData> {
        return this._statBreakdown;
    }

    /**
     * Updates the paths to monitor for storage usage
     * @param paths - Array of mount paths to monitor
     */
    public set pathsToMonitor(paths: string[]) {
        this._pathsToMonitor.set(unique(paths));
    }

    /**
     * Sets whether percentage values should be rounded to whole numbers
     * @param round - True to round percentages, false for 2 decimal places
     */
    public set round(round: boolean) {
        this._shouldRound.set(round);
    }

    /**
     * Updates the polling interval
     * @param timerInMs - Interval in milliseconds between updates
     */
    public set frequency(timerInMs: number) {
        this._updateFrequency.set(timerInMs);
    }

    /**
     * Calculates storage usage for multiple drives and returns both individual and total data
     */
    private _calculateMultiDriveUsage(): MultiDriveStorageData {
        try {
            const paths = this._pathsToMonitor.get();
            const drives = this._collectDriveData(paths);
            const total = this._calculateTotalUsage(drives);

            return { total, drives };
        } catch (error) {
            console.error('Error calculating multi-drive storage usage:', error);
            return this._getEmptyStorageData();
        }
    }

    /**
     * Collects storage data for each monitored drive
     * @param paths - Array of mount paths to monitor
     */
    private _collectDriveData(paths: string[]): DriveStorageData[] {
        return paths
            .map((path) => this._getDriveUsage(path))
            .filter((drive): drive is DriveStorageData => drive !== null);
    }

    /**
     * Gets storage usage for a single drive
     * @param path - The mount path of the drive
     */
    private _getDriveUsage(path: string): DriveStorageData | null {
        try {
            const fsUsage = new GTop.glibtop_fsusage();
            GTop.glibtop_get_fsusage(fsUsage, path);

            const total = fsUsage.blocks * fsUsage.block_size;
            const available = fsUsage.bavail * fsUsage.block_size;
            const used = total - available;

            if (total === 0) return null;

            return {
                path,
                name: this._extractDriveName(path),
                total,
                used,
                free: available,
                percentage: this._calculatePercentage(total, used),
            };
        } catch (error) {
            console.error(`Error getting storage info for ${path}:`, error);
            return null;
        }
    }

    /**
     * Extracts a readable name from a mount path
     * @param path - The mount path
     */
    private _extractDriveName(path: string): string {
        return path.split('/').filter(Boolean).pop() || path;
    }

    /**
     * Calculates total usage across all drives
     * @param drives - Array of drive data
     */
    private _calculateTotalUsage(drives: DriveStorageData[]): GenericResourceData {
        const totals = drives.reduce(
            (acc, drive) => ({
                total: acc.total + drive.total,
                used: acc.used + drive.used,
                free: acc.free + drive.free,
            }),
            { total: 0, used: 0, free: 0 },
        );

        return {
            ...totals,
            percentage: this._calculatePercentage(totals.total, totals.used),
        };
    }

    /**
     * Calculates percentage with rounding support
     * @param total - Total amount
     * @param used - Used amount
     */
    private _calculatePercentage(total: number, used: number): number {
        if (total === 0) return 0;

        const percentage = (used / total) * 100;
        const shouldRound = this._shouldRound.get();

        return shouldRound ? Math.round(percentage) : parseFloat(percentage.toFixed(2));
    }

    /**
     * Returns empty storage data structure
     */
    private _getEmptyStorageData(): MultiDriveStorageData {
        return {
            total: { total: 0, used: 0, percentage: 0, free: 0 },
            drives: [],
        };
    }
}

export default StorageService;
