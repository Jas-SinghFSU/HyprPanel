import { GtkWidget, Transition } from './widget';
import { Binding } from 'types/service';
import { Astal, Gtk } from 'astal/gtk3';
import { WindowProps } from 'astal/gtk3/widget';

export type DropdownMenuProps = {
    name: string;
    child: GtkWidget;
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
    fixed?: boolean;
} & WindowProps;
