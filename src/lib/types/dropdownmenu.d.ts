import { WindowProps } from 'types/widgets/window';
import { GtkWidget, Transition } from './widget';
import { Binding } from 'types/service';

export type DropdownMenuProps = {
    name: string;
    child: GtkWidget;
    layout?: string;
    transition?: Transition | Binding<Transition>;
    exclusivity?: Exclusivity;
    fixed?: boolean;
} & WindowProps;
