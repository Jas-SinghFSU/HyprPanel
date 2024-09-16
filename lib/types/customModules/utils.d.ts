import { Binding } from 'lib/utils';

export type InputHandlerEvents = {
    onPrimaryClick?: Binding;
    onSecondaryClick?: Binding;
    onMiddleClick?: Binding;
    onScrollUp?: Binding;
    onScrollDown?: Binding;
};
