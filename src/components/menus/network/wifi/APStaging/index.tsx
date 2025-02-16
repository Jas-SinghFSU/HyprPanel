import { bind } from 'astal/binding';
import { Variable } from 'astal';
import { AccessPoint } from './AccessPoint';
import { PasswordInput } from './PasswordInput';
import { connecting, staging } from '../WirelessAPs/helpers';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';

const networkService = AstalNetwork.get_default();

export const APStaging = (): JSX.Element => {
    const stagingBinding = Variable.derive([bind(networkService, 'wifi'), bind(staging)], () => {
        if (staging.get()?.ssid === undefined) {
            return <box />;
        }

        return (
            <box className="network-element-item staging" vertical>
                <AccessPoint connecting={connecting} staging={staging} />
                <PasswordInput connecting={connecting} staging={staging} />
            </box>
        );
    });
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
