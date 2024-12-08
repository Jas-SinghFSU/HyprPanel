import PowerProfiles from 'types/service/powerprofiles.js';

export type PowerProfiles = InstanceType<typeof PowerProfiles>;
export type PowerProfile = 'power-saver' | 'balanced' | 'performance';
export type PowerProfileObject = {
    [key: string]: string;
};
