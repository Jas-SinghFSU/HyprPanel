import { runAsyncCommand, throttledScrollHandler } from '../../utils/helpers.js';
import options from '../../../../options.js';
import { openMenu } from '../../utils/menu.js';
import { getDistroIcon } from '../../../../lib/utils.js';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { useHook } from 'src/lib/shared/hookHandler.js'; // Ensure correct import
import { BarBoxChild } from 'src/lib/types/bar.js';
import { Astal } from 'astal/gtk3';

const { rightClick, middleClick, scrollUp, scrollDown, autoDetectIcon, icon } = options.bar.launcher;

const Menu = (): BarBoxChild => {
    const componentClassName = bind(options.theme.bar.buttons.style).as((style: string) => {
        const styleMap: Record<string, string> = {
            default: 'style1',
            split: 'style2',
            wave: 'style3',
            wave2: 'style3',
        };
        return `dashboard ${styleMap[style]}`;
    });

    const component = (
        <box className={componentClassName}>
            <label
                className={'bar-menu_label bar-button_icon txt-icon bar'}
                label={Variable.derive([autoDetectIcon, icon], (autoDetect: boolean, iconValue: string): string =>
                    autoDetect ? getDistroIcon() : iconValue,
                )()}
            />
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'dashboard',
        props: {
            setup: (self: Astal.Button): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'dashboardmenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.value, scrollDown.value);

                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};

export { Menu };
