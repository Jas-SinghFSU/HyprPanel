import { bind } from 'astal/binding';
import { Variable } from 'astal';
import { AccessPoint } from './AccessPoint';
import { PasswordInput } from './PasswordInput';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { NetworkService } from 'src/services/network';

const networkService = NetworkService.getInstance();
const astalNetwork = AstalNetwork.get_default();
const isConnectingWithPassword = Variable(false);

export const APStaging = (): JSX.Element => {
    const stagingBinding = Variable.derive(
        [bind(astalNetwork, 'wifi'), bind(networkService.wifi.staging)],
        () => {
            if (networkService.wifi.staging.get()?.ssid === undefined) {
                isConnectingWithPassword.set(false);
                return <box />;
            }

            return (
                <box className="network-element-item staging" vertical>
                    <AccessPoint
                        connecting={networkService.wifi.connecting}
                        staging={networkService.wifi.staging}
                    />
                    <PasswordInput
                        connecting={networkService.wifi.connecting}
                        staging={networkService.wifi.staging}
                        isConnectingWithPassword={isConnectingWithPassword}
                    />
                </box>
            );
        },
    );
    return (
        <box
            className="wap-staging"
            onDestroy={() => {
                stagingBinding.drop();
            }}
        >
            {stagingBinding()}
        </box>
    );
};
