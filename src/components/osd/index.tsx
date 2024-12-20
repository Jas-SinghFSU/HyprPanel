import options from 'src/options';
import { getPosition } from 'src/lib/utils';
import { bind } from 'astal';
import { Astal } from 'astal/gtk3';
import { getOsdMonitor, windowSetup } from './helpers';
import { OsdRevealer } from './OsdRevealer';

const { location } = options.theme.osd;

export default (): JSX.Element => {
    return (
        <window
            monitor={getOsdMonitor()}
            name={'indicator'}
            namespace={'indicator'}
            className={'indicator'}
            visible={false}
            layer={bind(options.tear).as((tear) => (tear ? Astal.Layer.TOP : Astal.Layer.OVERLAY))}
            anchor={bind(location).as((anchorPoint) => getPosition(anchorPoint))}
            setup={windowSetup}
            clickThrough
        >
            <OsdRevealer />
        </window>
    );
};
