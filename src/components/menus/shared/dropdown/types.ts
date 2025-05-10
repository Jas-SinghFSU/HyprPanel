import { BarLocation } from 'src/lib/types/options.types';

export type EventBoxPaddingProps = {
    className: string;
    windowName: string;
};

export type BarEventMarginsProps = {
    windowName: string;
    location?: BarLocation;
};
