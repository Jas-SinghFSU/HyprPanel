import { getBackground } from './helpers.js';
import { Gtk } from 'astal/gtk3';
import { BindableChild } from 'astal/gtk3/astalify.js';

export const MediaContainer = ({ children }: MediaContainerProps): JSX.Element => {
    return (
        <box className={'menu-section-container'}>
            <box className={'menu-items-section'} vertical={false}>
                <box className={'menu-content'} css={getBackground()}>
                    <box className={'media-content'}>
                        <box className={'media-indicator-right-section'} halign={Gtk.Align.FILL} hexpand vertical>
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
