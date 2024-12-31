import options from 'src/options';
import { initThrottledScrollHandlers } from './helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import { WorkspaceModule } from './workspaces';
import { bind, Variable } from 'astal';
import { GtkWidget } from 'src/lib/types/widget';
import { Astal, Gdk } from 'astal/gtk3';
import { isScrollDown, isScrollUp } from 'src/lib/utils';

const { scroll_speed } = options.bar.workspaces;

const Workspaces = (monitor = -1): BarBoxChild => {
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
            setup: (self: Astal.EventBox): void => {
                let scrollHandlers: number;
                Variable.derive([bind(scroll_speed)], (scroll_speed) => {
                    if (scrollHandlers) {
                        self.disconnect(scrollHandlers);
                    }

                    const { throttledScrollUp, throttledScrollDown } = initThrottledScrollHandlers(scroll_speed);

                    scrollHandlers = self.connect('scroll-event', (_: GtkWidget, event: Gdk.Event) => {
                        if (isScrollUp(event)) {
                            throttledScrollUp();
                        }

                        if (isScrollDown(event)) {
                            throttledScrollDown();
                        }
                    });
                });
            },
        },
    };
};

export { Workspaces };
