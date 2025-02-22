import { openMenu } from '../../utils/menu';
import options from 'src/options';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { Astal } from 'astal/gtk3';
import { systemTime } from 'src/globals/time';

const { format, icon, showIcon, showTime, rightClick, middleClick, scrollUp, scrollDown } = options.bar.clock;
const { style } = options.theme.bar.buttons;

const times = format.split("|").map((timeFormat) => Variable.derive([systemTime, timeFormat.trim()], (c, f) => c.format(f) || ''))

const Clock = (): BarBoxChild => {
    const clockTime = (time): JSX.Element => <label className={'bar-button-label clock bar'} label={bind(time)} />;
    const ClockTime = (): JSX.Element => <div> {times.map((map) => clockTime(time))} </div>;
    const ClockIcon = (): JSX.Element => <label className={'bar-button-icon clock txt-icon bar'} label={bind(icon)} />;

    const componentClassName = Variable.derive(
        [bind(style), bind(showIcon), bind(showTime)],
        (btnStyle, shwIcn, shwLbl) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `clock-container ${styleMap[btnStyle]} ${!shwLbl ? 'no-label' : ''} ${!shwIcn ? 'no-icon' : ''}`;
        },
    );

    const componentChildren = Variable.derive([bind(showIcon), bind(showTime)], (shIcn, shTm) => {
        if (shIcn && !shTm) {
            return <ClockIcon />;
        } else if (shTm && !shIcn) {
            return <ClockTime />;
        }
        return (
            <box>
                <ClockIcon />
                <ClockTime />
            </box>
        );
    });

    const component = (
        <box
            className={componentClassName()}
            onDestroy={() => {
                componentClassName.drop();
                componentChildren.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'clock',
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
                                openMenu(clicked, event, 'calendarmenu');
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

export { Clock };
