import { Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { isPrimaryClick } from 'src/lib/utils';

export const FirstPageButton = ({ curPage, currentPage }: FirstPageButtonProps): JSX.Element => {
    return (
        <button
            hexpand={true}
            halign={Gtk.Align.START}
            className={`pager-button left ${currentPage <= 1 ? 'disabled' : ''}`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    curPage.set(1);
                }
            }}
        >
            <label className={'pager-button-label'} label={''} />
        </button>
    );
};

export const PreviousPageButton = ({ curPage, currentPage }: PreviousPageButtonProps): JSX.Element => {
    return (
        <button
            hexpand={true}
            halign={Gtk.Align.START}
            className={`pager-button left ${currentPage <= 1 ? 'disabled' : ''}`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    curPage.set(currentPage <= 1 ? 1 : currentPage - 1);
                }
            }}
        >
            <label className={'pager-button-label'} label={''} />
        </button>
    );
};

export const NextPageButton = ({
    curPage,
    currentPage,
    notifications,
    displayedTotal,
    dispTotal,
}: NextPageButtonProps): JSX.Element => {
    return (
        <button
            hexpand={true}
            halign={Gtk.Align.END}
            className={`pager-button right ${
                currentPage >= Math.ceil(notifications.length / dispTotal) ? 'disabled' : ''
            }`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    const maxPage = Math.ceil(notifications.length / displayedTotal.get());
                    curPage.set(currentPage >= maxPage ? maxPage : currentPage + 1);
                }
            }}
        >
            <label className={'pager-button-label'} label={''} />
        </button>
    );
};

export const LastPageButton = ({
    curPage,
    currentPage,
    notifications,
    displayedTotal,
    dispTotal,
}: LastPageButtonProps): JSX.Element => {
    return (
        <button
            hexpand={true}
            halign={Gtk.Align.END}
            className={`pager-button right ${
                currentPage >= Math.ceil(notifications.length / dispTotal) ? 'disabled' : ''
            }`}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    const maxPage = Math.ceil(notifications.length / displayedTotal.get());
                    curPage.set(maxPage);
                }
            }}
        >
            <label className={'pager-button-label'} label={'󰄾'} />
        </button>
    );
};

interface FirstPageButtonProps {
    curPage: Variable<number>;
    currentPage: number;
}

interface PreviousPageButtonProps {
    curPage: Variable<number>;
    currentPage: number;
}

interface NextPageButtonProps {
    curPage: Variable<number>;
    currentPage: number;
    notifications: AstalNotifd.Notification[];
    displayedTotal: Variable<number>;
    dispTotal: number;
}

interface LastPageButtonProps {
    curPage: Variable<number>;
    currentPage: number;
    notifications: AstalNotifd.Notification[];
    displayedTotal: Variable<number>;
    dispTotal: number;
}
