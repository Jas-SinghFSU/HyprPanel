import { bind } from 'astal/binding';
import { Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { AccessPoint } from './AccessPoint';

export const APStaging = ({ staging, connecting }: APStagingProps): JSX.Element => {
    const stagingBinding = Variable.derive([bind(networkService, 'wifi'), bind(staging)], () => {
        if (staging.get().ssid === undefined) {
            return <box />;
        }

        return (
            <box className="network-element-item staging" vertical>
                <AccessPoint connecting={connecting} staging={staging} />
            </box>
        );
    });
    return (
        <box
            className="wap-staging"
            setup={() => {
                stagingBinding.drop();
            }}
        >
            {stagingBinding()}
        </box>
    );
};

interface APStagingProps {
    staging: Variable<AstalNetwork.AccessPoint>;
    connecting: Variable<string>;
}