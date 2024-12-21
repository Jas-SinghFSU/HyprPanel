import { getBackground } from './helpers.js';
import { Gtk } from 'astal/gtk3';
import { BindableChild } from 'astal/gtk3/astalify.js';

export const MediaContainer = ({ children }: MediaContainerProps): JSX.Element => {
    return (
        <box className="menu-items media" halign={Gtk.Align.FILL} hexpand>
            <box className="menu-items-container media" halign={Gtk.Align.FILL} hexpand>
                <box className={'menu-section-container'}>
                    <box className={'menu-items-section'} vertical={false}>
                        <box className={'menu-content'} css={getBackground()} halign={Gtk.Align.FILL} hexpand vertical>
                            {children}
                        </box>
                    </box>
                </box>
            </box>
        </box>
    );
};

interface MediaContainerProps {
    children?: BindableChild | BindableChild[];
}
