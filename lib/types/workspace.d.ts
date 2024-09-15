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

export type WorkspaceIcons = {
    [key: string]: string;
};

export type WorkspaceIconsColored = {
    [key: string]: {
        color: string;
        icon: string;
    };
};

export type WorkspaceIconMap = WorkspaceIcons | WorkspaceIconsColored;
