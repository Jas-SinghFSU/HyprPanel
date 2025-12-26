import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/configuration';
import { Gtk } from 'astal/gtk3';

export const MediaMenuSettings = (): JSX.Element => {
    return (
        <scrollable name={'Media Menu'} vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className="bar-theme-page paged-container" vertical>
                <Header title="Media" />
                <Option
                    opt={options.menus.media.preferredPlayer}
                    title="Preferred Player"
                    subtitle="Identity name of the player to prioritize. Use 'hyprpanel mprisPlayers' to see available players with identities"
                    type="string"
                />
                <Option
                    opt={options.menus.media.ignore}
                    title="Ignored Applications"
                    subtitle="MPRIS clients to hide from the media player"
                    type="object"
                />
                <Option opt={options.menus.media.hideAuthor} title="Hide Author" type="boolean" />
                <Option opt={options.menus.media.hideAlbum} title="Hide Album" type="boolean" />
                <Option opt={options.menus.media.displayTime} title="Display Time Info" type="boolean" />
                <Option
                    opt={options.menus.media.displayTimeTooltip}
                    title="Display Time Tooltip"
                    subtitle="Show media time info on hover"
                    type="boolean"
                />
                <Option
                    opt={options.menus.media.noMediaText}
                    title="No Media Placeholder"
                    subtitle="Text when no media is playing"
                    type="string"
                />
            </box>
        </scrollable>
    );
};
