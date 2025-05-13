type CustomBarModuleActions = {
    onLeftClick?: string;
    onRightClick?: string;
    onMiddleClick?: string;
    onScrollUp?: string;
    onScrollDown?: string;
};
export type CustomBarModule = {
    icon?: CustomBarModuleIcon;
    label?: string;
    tooltip?: string;
    truncationSize?: number;
    execute?: string;
    executeOnAction?: string;
    interval?: number;
    hideOnEmpty?: boolean;
    scrollThreshold?: number;
    actions?: CustomBarModuleActions;
};
export type CustomBarModuleIcon = string | string[] | Record<string, string>;

export type WidgetMap = {
    [key in string]: (monitor: number) => JSX.Element;
};
