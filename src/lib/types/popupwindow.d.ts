import { Widget } from 'types/widgets/widget';
import { WindowProps } from 'types/widgets/window';
import { Transition } from './widget';

export type PopupWindowProps = {
    name: string;
    child: Widget;
    layout?: Layouts;
    transition?: Transition | Binding<Transition>;
    exclusivity?: Exclusivity;
} & WindowProps;

export type LayoutFunction = (
    name: string,
    child: Widget,
    transition: Transition,
) => {
    center: () => Widget;
    top: () => Widget;
    'top-right': () => Widget;
    'top-center': () => Widget;
    'top-left': () => Widget;
    'bottom-left': () => Widget;
    'bottom-center': () => Widget;
    'bottom-right': () => Widget;
};
export type Layouts =
    | 'center'
    | 'top'
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
