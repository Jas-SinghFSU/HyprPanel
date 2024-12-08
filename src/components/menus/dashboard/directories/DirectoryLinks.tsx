import { bind, execAsync, Variable } from 'astal';
import { App, Gtk, Widget } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import options from 'src/options';

const { left, right } = options.menus.dashboard.directories;

const DirectoryLink = ({ directoryItem, ...props }: DirectoryLinkProps): JSX.Element => {
    return (
        <button
            {...props}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    App.get_window('dashboardmenu')?.set_visible(false);
                    execAsync(directoryItem.command.get());
                }
            }}
        >
            <label label={bind(directoryItem.label)} halign={Gtk.Align.START} />
        </button>
    );
};
export const LeftLink1 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link left top'} directoryItem={left.directory1} />;
};
export const LeftLink2 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link left middle'} directoryItem={left.directory2} />;
};
export const LeftLink3 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link left bottom'} directoryItem={left.directory3} />;
};

export const RightLink1 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link right top'} directoryItem={right.directory1} />;
};
export const RightLink2 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link right middle'} directoryItem={right.directory2} />;
};
export const RightLink3 = (): JSX.Element => {
    return <DirectoryLink className={'directory-link right bottom'} directoryItem={right.directory3} />;
};

interface DirectoryLinkProps extends Widget.ButtonProps {
    directoryItem: {
        label: Variable<string>;
        command: Variable<string>;
    };
}
