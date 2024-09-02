import { Binding, Connectable } from "types/service"
import { Variable } from "types/variable"
import { Widget as WidgetType } from "types/widgets/widget"

export type Child = {
    component: Box<Gtk.Widget, unknown>;
    isVisible?: boolean;
    isVis?: Variable<boolean>;
    boxClass: string;
    props: ButtonProps;
};

export type Hook = (self: WidgetType<unknown>) => void;

export type Module = {
    icon?: string | Binding<string>,
    textIcon?: string | Binding<string>,
    label?: string | Binding<string>,
    boundLabel?: string,
    tooltipText?: string | Binding<string>,
    boxClass: string,
    props?: ButtonProps,
    showLabel?: Binding,
    hooks?: Hook[],
    connection?: Binding<Connectable>
}

export type ResourceLabelType = "mem/total" | "memory" | "percentage";

export type StorageIcon = "󰋊" | "" | "󱛟" | "";

export type NetstatIcon = "󰖟" | "󰇚" | "󰕒" | "󰛳" | "" | "󰣺" | "󰖩" | "" | "󰈀";
export type NetstatLabelType = "full" | "in" | "out";
export type RateUnit = "GiB" | "MiB" | "KiB" | "auto";
