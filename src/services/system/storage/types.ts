import { Variable } from 'astal';
import { GenericResourceData } from '../types';

export interface StorageServiceCtor {
    pathsToMonitor: Variable<string[]>;
    frequency?: Variable<number>;
    round?: Variable<boolean>;
}

export interface DriveStorageData extends GenericResourceData {
    path: string;
    name: string;
}

export interface MultiDriveStorageData {
    total: GenericResourceData;
    drives: DriveStorageData[];
}
