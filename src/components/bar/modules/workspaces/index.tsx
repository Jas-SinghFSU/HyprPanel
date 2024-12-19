import options from 'src/options';
import { createThrottledScrollHandlers, getCurrentMonitorWorkspaces } from './helpers';
import { BarBoxChild, SelfButton } from 'src/lib/types/bar';
import { WorkspaceModule } from './workspaces';
import { bind, Variable } from 'astal';
import { GtkWidget } from 'src/lib/types/widget';
import { Gdk } from 'astal/gtk3';

const { workspaces, scroll_speed } = options.bar.workspaces;

const Workspaces = (monitor = -1): BarBoxChild => {
    const currentMonitorWorkspaces = Variable(getCurrentMonitorWorkspaces(monitor));

    workspaces.subscribe(() => {
        currentMonitorWorkspaces.set(getCurrentMonitorWorkspaces(monitor));
    });

    const component = (
        <box className={'workspaces-box-container'}>
            <WorkspaceModule monitor={monitor} />
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'workspaces',
        isBox: true,
        props: {
            setup: (self: SelfButton): void => {
                Variable.derive([bind(scroll_speed)], (scroll_speed) => {
                    const { throttledScrollUp, throttledScrollDown } = createThrottledScrollHandlers(
                        scroll_speed,
                        currentMonitorWorkspaces,
                    );

                    const scrollHandlers = self.connect('scroll-event', (_: GtkWidget, event: Gdk.Event) => {
                        const eventDirection = event.get_scroll_direction()[1];
                        if (eventDirection === Gdk.ScrollDirection.UP) {
                            throttledScrollUp();
                        } else if (eventDirection === Gdk.ScrollDirection.DOWN) {
                            throttledScrollDown();
                        }
                    });

                    self.disconnect(scrollHandlers);
                });
            },
        },
    };
};

export { Workspaces };
