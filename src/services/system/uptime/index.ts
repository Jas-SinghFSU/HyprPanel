import { Variable } from 'astal';

export const uptime = Variable(0).poll(
    60_00,
    'cat /proc/uptime',
    (line): number => Number.parseInt(line.split('.')[0]) / 60,
);
