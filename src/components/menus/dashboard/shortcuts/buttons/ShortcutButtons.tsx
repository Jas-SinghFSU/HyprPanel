import { Widget } from 'astal/gtk3';
import { ShortcutVariable } from 'src/lib/types/dashboard';
import { isPrimaryClick } from 'src/lib/utils';
import { handleClick, hasCommand } from '../helpers';
import options from 'src/options';

const { left, right } = options.menus.dashboard.shortcuts;

const ShortcutButton = ({ shortcut, ...props }: ShortcutButtonProps): JSX.Element => {
    return (
        <button
            vexpand
            tooltipText={shortcut.tooltip.get()}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    handleClick(shortcut.command.get());
                }
            }}
            {...props}
        >
            <label className={'button-label txt-icon'} label={shortcut.icon.get()} />
        </button>
    );
};

export const LeftShortcut1 = (): JSX.Element => {
    return (
        <ShortcutButton
            shortcut={left.shortcut1}
            className={`dashboard-button top-button ${hasCommand(left.shortcut1) ? 'paired' : ''}`}
        />
    );
};

export const LeftShortcut2 = (): JSX.Element => {
    return <ShortcutButton shortcut={left.shortcut2} className={`dashboard-button`} />;
};

export const LeftShortcut3 = (): JSX.Element => {
    return (
        <ShortcutButton
            shortcut={left.shortcut3}
            className={`dashboard-button top-button ${hasCommand(left.shortcut3) ? 'paired' : ''}`}
        />
    );
};

export const LeftShortcut4 = (): JSX.Element => {
    return <ShortcutButton shortcut={left.shortcut4} className={`dashboard-button `} />;
};

export const RightShortcut1 = (): JSX.Element => {
    return <ShortcutButton shortcut={right.shortcut1} className={`dashboard-button top-button paired`} />;
};

export const RightShortcut3 = (): JSX.Element => {
    return <ShortcutButton shortcut={right.shortcut3} className={`dashboard-button top-button paired`} />;
};

interface ShortcutButtonProps extends Widget.ButtonProps {
    shortcut: ShortcutVariable;
}
