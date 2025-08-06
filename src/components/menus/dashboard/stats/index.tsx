import { Gtk } from 'astal/gtk3';
import { CpuStat, GpuStat, RamStat, StorageStat } from './StatBars';
import { setupDashboardMonitoring } from './helpers';
import { JSXElement } from 'src/core/types';

export const Stats = ({ isEnabled }: StatsProps): JSXElement => {
    if (!isEnabled) {
        return null;
    }

    setupDashboardMonitoring();

    return (
        <box
            className={'dashboard-card stats-container'}
            valign={Gtk.Align.FILL}
            halign={Gtk.Align.FILL}
            expand
            vertical
        >
            <CpuStat />
            <RamStat />
            <GpuStat />
            <StorageStat />
        </box>
    );
};

interface StatsProps {
    isEnabled: boolean;
}
