import DropdownMenu from '../shared/dropdown/index.js';
import { Controls } from './controls/index.js';
import { NotificationCard } from './notification/index.js';
import { NotificationPager } from './pager/index.js';
import options from 'src/options.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import Variable from 'astal/variable.js';
import { handlePageBoundaries } from './helpers.js';
import { bind } from 'astal/binding.js';

const { transition } = options.menus;

export default (): GtkWidget => {
    const curPage = Variable(1);

    handlePageBoundaries(curPage);

    <DropdownMenu
        name={'notificationsmenu'}
        transition={bind(transition)}
        child={
            <box className={'notification-menu-content'} css={'padding: 1px; margin: -1px;'} hexpand vexpand>
                <box className={'notification-card-container menu'} hexpand vexpand vertical>
                    <Controls />
                    {/* <NotificationCard curPage={curPage} /> */}
                    {/* <NotificationPager curPage={curPage} /> */}
                </box>
            </box>
        }
    />;
};
