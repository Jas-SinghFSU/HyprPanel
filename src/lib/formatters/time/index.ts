import { GLib, Variable } from 'astal';

export const systemTime = Variable(GLib.DateTime.new_now_local()).poll(
    1000,
    (): GLib.DateTime => GLib.DateTime.new_now_local(),
);

export function toEpochTime(timestamp: Date): number {
    return Math.floor(timestamp.getTime() / 1000);
}
