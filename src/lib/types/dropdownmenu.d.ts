import { GtkWidget, Transition } from './widget';
import { Astal, Gtk } from 'astal/gtk3';
import { WindowProps } from 'astal/gtk3/widget';
import { Opt } from '../option';
import { Binding } from 'astal';
import { BindableChild } from 'astal/gtk3/astalify';

export interface DropdownMenuProps extends WindowProps {
    name: string;
    child?: BindableChild | BindableChild[];
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
    fixed?: boolean;
}
