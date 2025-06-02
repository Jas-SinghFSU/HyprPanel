import options from 'src/configuration';
import { bind } from 'astal';
import { App, Astal } from 'astal/gtk3';
import { getOsdMonitor } from './helpers';
import { getPosition } from 'src/lib/window/positioning';
import { OsdRevealer } from './revealer';

const { location } = options.theme.osd;

export default (): JSX.Element => {
    const osdMonitorBinding = getOsdMonitor();

    return (
        <window
            monitor={osdMonitorBinding()}
            name={'indicator'}
            application={App}
            namespace={'indicator'}
            className={'indicator'}
            visible={true}
            layer={bind(options.tear).as((tear) => (tear ? Astal.Layer.TOP : Astal.Layer.OVERLAY))}
            anchor={bind(location).as((anchorPoint) => getPosition(anchorPoint))}
            setup={(self) => {
                osdMonitorBinding().subscribe(() => {
                    self.set_click_through(true);
                });
            }}
            onDestroy={() => {
                osdMonitorBinding.drop();
            }}
            clickThrough
        >
            <OsdRevealer />
        </window>
    );
};
