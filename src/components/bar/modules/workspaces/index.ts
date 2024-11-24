import options from 'options';
import { createThrottledScrollHandlers, getCurrentMonitorWorkspaces } from './helpers';
import { BarBoxChild, SelfButton } from 'src/lib/types/bar';
import { occupiedWses } from './variants/occupied';
import { defaultWses } from './variants/default';
import { Variable } from 'astal';

const { workspaces, scroll_speed } = options.bar.workspaces;

const Workspaces = (monitor = -1): BarBoxChild => {
    const currentMonitorWorkspaces = Variable(getCurrentMonitorWorkspaces(monitor));

    workspaces.subscribe(() => {
        currentMonitorWorkspaces.set(getCurrentMonitorWorkspaces(monitor));
    });

    return {
        component: Widget.Box({
            class_name: 'workspaces-box-container',
            child: options.bar.workspaces.hideUnoccupied.bind().as((hideUnoccupied) => {
                return hideUnoccupied ? occupiedWses(monitor) : defaultWses(monitor);
            }),
        }),
        isVisible: true,
        boxClass: 'workspaces',
        props: {
            setup: (self: SelfButton): void => {
                Utils.merge(
                    [scroll_speed.bind(), options.bar.workspaces.hideUnoccupied.bind()],
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
