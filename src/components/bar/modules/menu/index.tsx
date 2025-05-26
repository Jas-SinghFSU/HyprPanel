import { Variable, bind } from 'astal';
import { onPrimaryClick, onSecondaryClick, onMiddleClick, onScroll } from 'src/lib/shared/eventHandlers';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types.js';
import { SystemUtilities } from 'src/core/system/SystemUtilities';
import options from 'src/configuration';
import { runAsyncCommand } from '../../utils/input/commandExecutor';
import { throttledScrollHandler } from '../../utils/input/throttle';
import { openDropdownMenu } from '../../utils/menu';

const { rightClick, middleClick, scrollUp, scrollDown, autoDetectIcon, icon } = options.bar.launcher;

const Menu = (): BarBoxChild => {
    const iconBinding = Variable.derive(
        [autoDetectIcon, icon],
        (autoDetect: boolean, iconValue: string): string =>
            autoDetect ? SystemUtilities.getDistroIcon() : iconValue,
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
                                openDropdownMenu(clicked, event, 'dashboardmenu');
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

                        disconnectFunctions.push(
                            onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()),
                        );
                    },
                );
            },
        },
    };
};

export { Menu };
