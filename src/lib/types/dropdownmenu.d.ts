import { WindowProps } from 'types/widgets/window';
import { GtkWidget, Transition } from './widget';
import { Binding } from 'types/service';
import { Astal, Gtk } from 'astal/gtk3';

export type DropdownMenuProps = {
    name: string;
    child: GtkWidget;
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Exclusivity;
    fixed?: boolean;
} & WindowProps;
