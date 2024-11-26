import { runAsyncCommand, throttledScrollHandler } from '../../utils/bar.js';
import { Gdk } from 'astal/gtk3';
import options from '../../../../options.js';
import { openMenu } from '../../utils/menu.js';
import { getDistroIcon } from '../../../../lib/utils.js';
import { GdkEvent, GtkWidget } from '../../../../lib/types/widget.js';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';

const { rightClick, middleClick, scrollUp, scrollDown, autoDetectIcon, icon } = options.bar.launcher;

const Menu = (): GtkWidget => {
    const componentClassName = bind(options.theme.bar.buttons.style).as((style) => {
        const styleMap = {
            default: 'style1',
            split: 'style2',
            wave: 'style3',
            wave2: 'style3',
        };
        return `dashboard ${styleMap[style]}`;
    });

    const component = (
        <box className={componentClassName}>
            <label className={'bar-menu_label bar-button_icon txt-icon bar'}>
                {Variable.derive([autoDetectIcon.bind(), icon.bind()], (autoDetect, icon): string =>
                    autoDetect ? getDistroIcon() : icon,
                )}
            </label>
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'dashboard',
        props: {
            on_primary_click: (clicked: GtkWidget, event: GdkEvent): void => {
                openMenu(clicked, event, 'dashboardmenu');
            },
            setup: (self: GtkWidget): void => {
                self.hook(options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    self.on_secondary_click = (clicked: GtkWidget, event: Gdk.Event): void => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    };
                    self.on_middle_click = (clicked: GtkWidget, event: Gdk.Event): void => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    };
                    self.on_scroll_up = (clicked: GtkWidget, event: Gdk.Event): void => {
                        throttledHandler(scrollUp.value, { clicked, event });
                    };
                    self.on_scroll_down = (clicked: GtkWidget, event: Gdk.Event): void => {
                        throttledHandler(scrollDown.value, { clicked, event });
                    };
                });
            },
        },
    };
};

export { Menu };
