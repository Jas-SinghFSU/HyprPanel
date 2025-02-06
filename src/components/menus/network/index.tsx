import DropdownMenu from '../shared/dropdown/index.js';
import { Ethernet } from './ethernet/index.js';
import { Wifi } from './wifi/index.js';
import options from 'src/options.js';
import { bind } from 'astal';
import { NoWifi } from './wifi/WirelessAPs/NoWifi.js';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const networkService = AstalNetwork.get_default();

export default (): JSX.Element => {
    return (
        <DropdownMenu
            name={'networkmenu'}
            transition={bind(options.menus.transition).as((transition) => RevealerTransitionMap[transition])}
        >
            <box className={'menu-items network'}>
                <box className={'menu-items-container network'} vertical hexpand>
                    <Ethernet />
                    {bind(networkService, 'wifi').as((wifi) => {
                        if (wifi === null) {
                            return <NoWifi />;
                        }
                        return <Wifi />;
                    })}
                </box>
            </box>
        </DropdownMenu>
    );
};
