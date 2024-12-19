import DropdownMenu from '../shared/dropdown/index.js';
import { Controls } from './controls/index.js';
import { NotificationsContainer } from './notification/index.js';
import { NotificationPager } from './pager/index.js';
import options from 'src/options.js';
import Variable from 'astal/variable.js';
import { handlePageBoundaries } from './helpers.js';
import { bind } from 'astal/binding.js';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';

const { transition } = options.menus;

export default (): JSX.Element => {
    const curPage = Variable(1);

    handlePageBoundaries(curPage);

    return (
        <DropdownMenu
            name={'notificationsmenu'}
            transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}
            onDestroy={() => {
                curPage.drop();
            }}
        >
            <box className={'notification-menu-content'} css={'padding: 1px; margin: -1px;'} hexpand vexpand>
                <box className={'notification-card-container menu'} hexpand vexpand vertical>
                    <Controls />
                    <NotificationsContainer curPage={curPage} />
                    <NotificationPager curPage={curPage} />
                </box>
            </box>
        </DropdownMenu>
    );
};
