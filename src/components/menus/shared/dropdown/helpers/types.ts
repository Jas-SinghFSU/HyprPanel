import { BarLocation } from 'src/lib/options/types';

export type EventBoxPaddingProps = {
    className: string;
    windowName: string;
};

export type BarEventMarginsProps = {
    windowName: string;
    location?: BarLocation;
};
