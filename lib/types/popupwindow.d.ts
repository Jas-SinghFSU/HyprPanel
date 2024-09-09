import { Widget } from "types/widgets/widget";
import { WindowProps } from "types/widgets/window";
import { Transition } from "./widget";

export type PopupWindowProps = {
    name: string;
    child: any;
    layout?: Layout;
    transition?: any;
    exclusivity?: Exclusivity;
} & WindowProps;

export type LayoutFunction = (
    name: string,
    child: Widget,
    transition: Transition
) => {
    center: () => Widget;
    top: () => Widget;
    "top-right": () => Widget;
    "top-center": () => Widget;
    "top-left": () => Widget;
    "bottom-left": () => Widget;
    "bottom-center": () => Widget;
    "bottom-right": () => Widget;
};
