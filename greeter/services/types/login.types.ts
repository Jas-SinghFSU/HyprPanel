type SessionName = string;
type SessionExecutable = string;

export type DesktopSessions = {
    [key: SessionName]: SessionExecutable;
};
