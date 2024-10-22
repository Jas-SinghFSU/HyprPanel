import { Binding, Connectable } from 'types/service';
import { Variable } from 'types/variable';
import Box from 'types/widgets/box';
import Button, { ButtonProps } from 'types/widgets/button';
import Label from 'types/widgets/label';
import { Attribute, Child } from './widget';

export type BarBoxChild = {
    component: Box<Gtk.Widget, unknown>;
    isVisible?: boolean;
    isVis?: Variable<boolean>;
    boxClass: string;
    tooltip_text?: string | Binding<string>;
    props: ButtonProps;
};

export type SelfButton = Button<Child, Attribute>;

export type BoxHook = (self: Box<Gtk.Widget, Gtk.Widget>) => void;
export type LabelHook = (self: Label<Gtk.Widget>) => void;

export type Module = {
    icon?: string | Binding<string>;
    textIcon?: string | Binding<string>;
    label?: string | Binding<string>;
    labelHook?: LabelHook;
    boundLabel?: string;
    tooltipText?: string | Binding<string>;
    boxClass: string;
    props?: ButtonProps;
    showLabel?: boolean;
    showLabelBinding?: Binding;
    hook?: BoxHook;
    connection?: Binding<Connectable>;
};

export type ResourceLabelType = 'used/total' | 'used' | 'percentage' | 'free';

export type NetstatLabelType = 'full' | 'in' | 'out';
export type RateUnit = 'GiB' | 'MiB' | 'KiB' | 'auto';


