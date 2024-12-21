import { Gtk } from 'astal/gtk3';
import { CpuStat, GpuStat, RamStat, StorageStat } from './StatBars';
import { initializePollers } from './helpers';
import Gpu from 'src/services/Gpu';
import Ram from 'src/services/Ram';
import Cpu from 'src/services/Cpu';
import Storage from 'src/services/Storage';

export const ramService = new Ram();
export const cpuService = new Cpu();
export const storageService = new Storage();
export const gpuService = new Gpu();

initializePollers(cpuService, ramService, gpuService, storageService);

export const Stats = ({ isEnabled }: StatsProps): JSX.Element => {
    if (!isEnabled) {
        return <box />;
    }

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
