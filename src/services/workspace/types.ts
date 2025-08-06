export type WorkspaceRule = {
    workspaceString: string;
    monitor: string;
};

export type WorkspaceMonitorMap = {
    [key: string]: number[];
};

export type MonitorMap = {
    [key: number]: string;
};
