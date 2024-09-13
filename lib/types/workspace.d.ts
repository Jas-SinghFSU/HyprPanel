export type WorkspaceRule = {
    workspaceString: string;
    monitor: string;
};

export type WorkspaceMap = {
    [key: string]: number[];
};

export type MonitorMap = {
    [key: number]: string;
};
