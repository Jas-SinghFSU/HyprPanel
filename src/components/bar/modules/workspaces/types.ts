export type WorkspaceIcons = {
    [key: string]: string;
};

export type WorkspaceIconsColored = {
    [key: string]: {
        color: string;
        icon: string;
    };
};
export type ApplicationIcons = {
    [key: string]: string;
};

export type WorkspaceIconMap = WorkspaceIcons | WorkspaceIconsColored;
