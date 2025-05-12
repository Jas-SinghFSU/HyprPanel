import { Widget } from 'astal/gtk3';
import { Binding, Variable } from 'astal';
import { Connectable } from 'astal/binding';
import { BoxWidget } from './widget.types';
import { Label } from 'astal/gtk3/widget';

export type BarBoxChild = {
    component: JSX.Element;
    isVisible?: boolean;
    isVis?: Binding<boolean>;
    isBox?: boolean;
    boxClass: string;
    tooltip_text?: string | Binding<string>;
} & ({ isBox: true; props: Widget.EventBoxProps } | { isBox?: false; props: Widget.ButtonProps });

export type BoxHook = (self: BoxWidget) => void;
export type LabelHook = (self: Label) => void;

export type BarModuleProps = {
    icon?: string | Binding<string>;
    textIcon?: string | Binding<string>;
    useTextIcon?: Binding<boolean>;
    label?: string | Binding<string>;
    truncationSize?: Binding<number>;
    labelHook?: LabelHook;
    boundLabel?: string;
    tooltipText?: string | Binding<string>;
    boxClass: string;
    isVis?: Binding<boolean>;
    props?: Widget.ButtonProps;
    showLabel?: boolean;
    showLabelBinding?: Binding<boolean>;
    showIconBinding?: Binding<boolean>;
    hook?: BoxHook;
    connection?: Binding<Connectable>;
};

export type ResourceLabelType = 'used/total' | 'used' | 'percentage' | 'free';

export type NetstatLabelType = 'full' | 'in' | 'out';
export type RateUnit = 'GiB' | 'MiB' | 'KiB' | 'auto';
