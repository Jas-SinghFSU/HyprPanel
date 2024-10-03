import options from 'options';
import { createThrottledScrollHandlers, getCurrentMonitorWorkspaces } from './helpers';
import { BarBoxChild, SelfButton } from 'lib/types/bar';
import { occupiedWses } from './variants/occupied';
import { defaultWses } from './variants/default';

const { workspaces, scroll_speed } = options.bar.workspaces;

const Workspaces = (monitor = -1): BarBoxChild => {
    const currentMonitorWorkspaces = Variable(getCurrentMonitorWorkspaces(monitor));

    workspaces.connect('changed', () => {
        currentMonitorWorkspaces.value = getCurrentMonitorWorkspaces(monitor);
    });

    return {
        component: Widget.Box({
            class_name: 'workspaces-box-container',
            child: options.bar.workspaces.hideUnoccupied.bind('value').as((hideUnoccupied) => {
                return hideUnoccupied ? occupiedWses(monitor) : defaultWses(monitor);
            }),
        }),
        isVisible: true,
        boxClass: 'workspaces',
        props: {
            setup: (self: SelfButton): void => {
                Utils.merge(
                    [scroll_speed.bind('value'), options.bar.workspaces.hideUnoccupied.bind('value')],
                    (scroll_speed, hideUnoccupied) => {
                        const { throttledScrollUp, throttledScrollDown } = createThrottledScrollHandlers(
                            scroll_speed,
                            currentMonitorWorkspaces,
                            hideUnoccupied,
                        );
                        self.on_scroll_up = throttledScrollUp;
                        self.on_scroll_down = throttledScrollDown;
                    },
                );
            },
        },
    };
};

export { Workspaces };
