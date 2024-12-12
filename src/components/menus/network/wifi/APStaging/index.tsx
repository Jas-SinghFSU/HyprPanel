import { bind } from 'astal/binding';
import { Variable } from 'astal';
import { networkService } from 'src/lib/constants/services';
import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import { PasswordInput } from './PasswordInput';
import { AccessPoint } from './AccessPoint';

export const APStaging = ({ staging, connecting }: APStagingProps): JSX.Element => {
    return (
        <box className="wap-staging">
            {Variable.derive([bind(networkService, 'wifi'), bind(staging)], () => {
                if (staging.get().ssid === undefined) {
                    return <box />;
                }

                return (
                    <box className="network-element-item staging" vertical>
                        <AccessPoint connecting={connecting} staging={staging} />
                        <PasswordInput connecting={connecting} staging={staging} />
                    </box>
                );
            })()}
        </box>
    );
};

interface APStagingProps {
    staging: Variable<AstalNetwork.AccessPoint>;
    connecting: Variable<string>;
}
