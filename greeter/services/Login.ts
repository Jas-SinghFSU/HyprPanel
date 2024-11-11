import { bash } from 'lib/utils';
import { DesktopSessions } from './types/login.types';
import Gio from 'gi://Gio?version=2.0';

class Login {
    private users: string[] = [];
    private sessions: DesktopSessions[] = [];

    constructor() {}

    public static async create(): Promise<Login> {
        const login = new Login();
        await login.initialize();
        return login;
    }

    private async initialize(): Promise<void> {
        await this.getAllUsers();
        await this.getAllSessions();
    }

    private async getAllUsers(): Promise<void> {
        const allUsers = await bash("cat /etc/passwd | grep '/home' | cut -d: -f1");
        const allUsersArray = allUsers.split('\n').filter((user: string) => user.trim() !== '');
        this.users = allUsersArray;
    }

    private async getAllSessionPaths(): Promise<string[]> {
        const sessionFilePaths: string[] = [];

        const allXSessions = await bash('ls /usr/share/xsessions/');
        const xSessionsArray = allXSessions.split('\n');
        xSessionsArray.forEach((sesh) => {
            sessionFilePaths.push(`/usr/share/xsessions/${sesh}`);
        });

        const allWaylandSessions = await bash('ls /usr/share/wayland-sessions/');
        const waylandSessionsArray = allWaylandSessions.split('\n');
        waylandSessionsArray.forEach((sesh) => {
            sessionFilePaths.push(`/usr/share/wayland-sessions/${sesh}`);
        });

        return sessionFilePaths;
    }

    private getSessionFileContent(sessionFilePath: string): string {
        try {
            const sessionFile = Gio.File.new_for_path(sessionFilePath);
            const [success, contents] = sessionFile.load_contents(null);

            if (success) {
                const fileContents = new TextDecoder().decode(contents);
                return fileContents;
            }
        } catch (error) {
            console.error(`Failed to read file at ${sessionFilePath}: ${error}`);
        }

        return '';
    }

    private getSessionName(sessionFile: string): string | undefined {
        const lines = sessionFile.split('\n');

        for (const line of lines) {
            if (line.startsWith('Name=')) {
                return line.split('=')[1].trim();
            }
        }
    }

    private getSessionExecCommand(sessionFile: string): string | undefined {
        const lines = sessionFile.split('\n');

        for (const line of lines) {
            if (line.startsWith('Exec=')) {
                return line.split('=')[1].trim();
            }
        }
    }

    public async getAllSessions(): Promise<void> {
        const allSessionPaths = await this.getAllSessionPaths();

        allSessionPaths.forEach((sessionPath) => {
            const fileContent = this.getSessionFileContent(sessionPath);

            const sessionName = this.getSessionName(fileContent);
            const sessionExec = this.getSessionExecCommand(fileContent);

            if (sessionName && sessionExec) {
                this.sessions.push({
                    [sessionName]: sessionExec,
                });
            }
        });
    }
}

export default Login;
