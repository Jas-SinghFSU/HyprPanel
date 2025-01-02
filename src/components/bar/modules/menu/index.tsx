import { runAsyncCommand, throttledScrollHandler } from '../../utils/helpers.js';
import options from '../../../../options.js';
import { openMenu } from '../../utils/menu.js';
import { getDistroIcon } from '../../../../lib/utils.js';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { Astal } from 'astal/gtk3';

const { rightClick, middleClick, scrollUp, scrollDown, autoDetectIcon, icon } = options.bar.launcher;

const Menu = (): BarBoxChild => {
    const iconBinding = Variable.derive([autoDetectIcon, icon], (autoDetect: boolean, iconValue: string): string =>
        autoDetect ? getDistroIcon() : iconValue,
    );

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
        <box
            className={componentClassName}
            onDestroy={() => {
                iconBinding.drop();
            }}
        >
            <label className={'bar-menu_label bar-button_icon txt-icon bar'} label={iconBinding()} />
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'dashboard',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                openMenu(clicked, event, 'dashboardmenu');
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()));
                    },
                );
            },
        },
    };
};

export { Menu };
