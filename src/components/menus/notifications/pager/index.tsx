import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { notifdService } from 'src/lib/constants/services';
import options from 'src/options';
import { FirstPageButton, LastPageButton, NextPageButton, PreviousPageButton } from './Buttons';

const { displayedTotal } = options.notifications;
const { show: showPager } = options.theme.bar.menus.menu.notifications.pager;

const PageDisplay = ({ notifications, currentPage, dispTotal }: PageDisplayProps): JSX.Element => {
    return (
        <label
            hexpand={true}
            halign={Gtk.Align.CENTER}
            className={'pager-label'}
            label={`${currentPage} / ${Math.ceil(notifications.length / dispTotal) || 1}`}
        />
    );
};

export const NotificationPager = ({ curPage }: NotificationPagerProps): JSX.Element => {
    const pagerBinding = Variable.derive(
        [bind(curPage), bind(displayedTotal), bind(notifdService, 'notifications'), bind(showPager)],
        (currentPage, dispTotal, notifications, showPgr) => {
            if (showPgr === false || (currentPage === 1 && notifications.length <= dispTotal)) {
                return <box />;
            }

            return (
                <box>
                    <FirstPageButton curPage={curPage} currentPage={currentPage} />
                    <PreviousPageButton curPage={curPage} currentPage={currentPage} />
                    <PageDisplay notifications={notifications} currentPage={currentPage} dispTotal={dispTotal} />
                    <NextPageButton
                        curPage={curPage}
                        currentPage={currentPage}
                        notifications={notifications}
                        displayedTotal={displayedTotal}
                        dispTotal={dispTotal}
                    />
                    <LastPageButton
                        curPage={curPage}
                        currentPage={currentPage}
                        notifications={notifications}
                        displayedTotal={displayedTotal}
                        dispTotal={dispTotal}
                    />
                </box>
            );
        },
    );

    return (
        <box
            className={'notification-menu-pager'}
            hexpand={true}
            vexpand={false}
            onDestroy={() => {
                pagerBinding.drop();
            }}
        >
            {pagerBinding()}
        </box>
    );
};

interface NotificationPagerProps {
    curPage: Variable<number>;
}

interface PageDisplayProps {
    notifications: AstalNotifd.Notification[];
    currentPage: number;
    dispTotal: number;
}
