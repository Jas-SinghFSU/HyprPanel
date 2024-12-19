import { App } from 'astal/gtk3';
import { BarEventMarginsProps, EventBoxPaddingProps } from '../types';

const EventBoxPadding = ({ className, windowName }: EventBoxPaddingProps): JSX.Element => {
    return (
        <eventbox
            className={className}
            hexpand
            vexpand={false}
            canFocus={false}
            setup={(self) => {
                self.connect('button-press-event', () => App.toggle_window(windowName));
            }}
        >
            <box />
        </eventbox>
    );
};

export const BarEventMargins = ({ windowName, location = 'top' }: BarEventMarginsProps): JSX.Element => {
    if (location === 'top') {
        return (
            <box className="event-box-container">
                <EventBoxPadding className="mid-eb event-top-padding-static" windowName={windowName} />
                <EventBoxPadding className="mid-eb event-top-padding" windowName={windowName} />
            </box>
        );
    } else {
        return (
            <box className="event-box-container">
                <EventBoxPadding className="mid-eb event-bottom-padding-static" windowName={windowName} />
            </box>
        );
    }
};
