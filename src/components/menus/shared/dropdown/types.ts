import { BarLocation } from 'src/lib/options/options.types';

export type EventBoxPaddingProps = {
    className: string;
    windowName: string;
};

export type BarEventMarginsProps = {
    windowName: string;
    location?: BarLocation;
};
