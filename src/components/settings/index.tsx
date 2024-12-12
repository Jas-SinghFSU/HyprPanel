import { App } from 'astal/gtk3';
import RegularWindow from '../shared/RegularWindow';
import './side_effects/index';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

export default (): JSX.Element => {
    return (
        <RegularWindow
            className={'settings-dialog'}
            visible={false}
            name={'settings-dialog'}
            title={'hyprpanel-settings'}
            application={App}
            setup={(self) => {
                self.connect('delete-event', () => {
                    self.hide();
                    return true;
                });
                self.set_default_size(200, 300);
            }}
        >
            <box className={'settings-dialog-box'} vertical>
                <Header />
                <PageContainer />
            </box>
        </RegularWindow>
    );
};
