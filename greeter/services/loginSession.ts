const greetd = await Service.import('greetd');
import { bash } from 'lib/utils';
import { DesktopSessions } from './types/login.types';
import Gio from 'gi://Gio?version=2.0';
import GdkPixbuf from 'gi://GdkPixbuf?version=2.0';

class LoginSession {
    /**
     * Array of system users.
     */
    private readonly users: string[] = [];

    /**
     * Array of desktop sessions.
     */
    private sessions: DesktopSessions[] = [];

    /**
     * Whether the user in logging in.
     */
    public loggingIn = Variable(false);

    public profilePic = Variable(`${App.configDir}/assets/images/avatar.png`);

    public userName = Variable('');
    public password = Variable('');

    public currentSession = Variable<DesktopSessions>([]);

    private constructor() {
        this.userName.connect('changed', () => {
            this.profilePic.value = this.getProfilePicture(this.users[0]);
            this.password.value = '';
        });
    }

    /**
     * Factory method to create and initialize a Login instance.
     *
     * @returns  A fully initialized Login instance.
     */
    public static async create(): Promise<LoginSession> {
        const login = new LoginSession();
        await login.initialize();
        return login;
    }

    /**
     * Performs all necessary asynchronous initialization tasks.
     */
    private async initialize(): Promise<void> {
        await this.getAllUsers();
        await this.getAllSessions();

        this.userName.value = this.users[0];

        const firstSessionInList = this.sessions[0];
        this.currentSession.value = firstSessionInList as DesktopSessions;
        console.log(this.currentSession.value);
    }

    /**
     * Fetches all system users by reading the /etc/passwd file.
     * Filters users with a home directory.
     */
    private async getAllUsers(): Promise<void> {
        try {
            const allUsers = await bash("cat /etc/passwd | grep '/home' | cut -d: -f1");
            const allUsersArray = allUsers
                .split('\n')
                .map((user) => user.trim())
                .filter((user) => user !== '');

            this.users.push(...allUsersArray);
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    /**
     * Retrieves all session file paths from X and Wayland sessions directories.
     *
     * @returns An array of session file paths.
     */
    private async getAllSessionPaths(): Promise<string[]> {
        const sessionFilePaths: string[] = [];

        try {
            const allXSessions = await bash('ls /usr/share/xsessions/');
            const xSessionsArray = allXSessions
                .split('\n')
                .map((sesh) => sesh.trim())
                .filter((sesh) => sesh !== '');
            xSessionsArray.forEach((sesh) => {
                sessionFilePaths.push(`/usr/share/xsessions/${sesh}`);
            });

            const allWaylandSessions = await bash('ls /usr/share/wayland-sessions/');
            const waylandSessionsArray = allWaylandSessions
                .split('\n')
                .map((sesh) => sesh.trim())
                .filter((sesh) => sesh !== '');
            waylandSessionsArray.forEach((sesh) => {
                sessionFilePaths.push(`/usr/share/wayland-sessions/${sesh}`);
            });
        } catch (error) {
            console.error(`Error fetching session paths: ${error}`);
            throw error;
        }

        return sessionFilePaths;
    }

    /**
     * Reads the content of a session file.
     *
     * @param  sessionFilePath - The path to the session file.
     * @returns The content of the session file as a string.
     */
    private getSessionFileContent(sessionFilePath: string): string {
        try {
            const sessionFile = Gio.File.new_for_path(sessionFilePath);
            const [success, contents] = sessionFile.load_contents(null);

            if (success) {
                const fileContents = new TextDecoder().decode(contents);
                return fileContents;
            } else {
                console.error(`Failed to load contents of ${sessionFilePath}`);
            }
        } catch (error) {
            console.error(`Failed to read file at ${sessionFilePath}: ${error}`);
        }

        return '';
    }

    /**
     * Parses the session file content to extract a specified key's value.
     *
     * @param sessionFile - The content of the session file.
     * @param key - The key to extract the value for (e.g., 'Name', 'Exec').
     * @returns The value associated with the key, or undefined if not found.
     */
    private parseSessionFile(sessionFile: string, key: string): string | undefined {
        const lines = sessionFile.split('\n');

        for (const line of lines) {
            if (line.startsWith(`${key}=`)) {
                const parts = line.split('=');
                if (parts.length > 1) {
                    return parts[1].trim();
                }
            }
        }
    }

    /**
     * Extracts the session name from the session file content.
     *
     * @param sessionFile - The content of the session file.
     * @returns The session name if found; otherwise, undefined.
     */
    private getSessionName(sessionFile: string): string | undefined {
        return this.parseSessionFile(sessionFile, 'Name');
    }

    /**
     * Extracts the Exec command from the session file content.
     *
     * @param sessionFile - The content of the session file.
     * @returns The Exec command if found; otherwise, undefined.
     */
    private getSessionExecCommand(sessionFile: string): string | undefined {
        return this.parseSessionFile(sessionFile, 'Exec');
    }

    /**
     * Fetches all session information and populates the sessions array.
     */
    private async getAllSessions(): Promise<void> {
        try {
            const allSessionPaths = await this.getAllSessionPaths();

            const sessionArray = [];
            for (const sessionPath of allSessionPaths) {
                const fileContent = this.getSessionFileContent(sessionPath);

                const sessionName = this.getSessionName(fileContent);
                const sessionExec = this.getSessionExecCommand(fileContent);

                if (sessionName && sessionExec) {
                    sessionArray.push([sessionName, sessionExec]);
                }
            }

            const sortedSessionArray = sessionArray.sort((a, b) => a[0].localeCompare(b[0]));

            this.sessions = sortedSessionArray as DesktopSessions[];
        } catch (error) {
            console.error(`Error fetching all sessions: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the list of system users.
     *
     * @returns  An array of user names.
     */
    public getUsers(): string[] {
        return this.users;
    }

    /**
     * Retrieves the list of desktop sessions.
     *
     * @returns  An array of DesktopSessions objects.
     */
    public getSessions(): DesktopSessions[] {
        return this.sessions;
    }

    /**
     * Retrieves the profile picture of the user.
     *
     * @returns  A path to the profile picture of the user or a
     * default avatar if user profile picture doesn't exist.
     */
    public getProfilePicture(user: string): string {
        const defaultAvatar = `${App.configDir}/assets/images/avatar.png`;
        const userProfilePicture = `/var/lib/AccountsService/icons/${user}`;

        const file = Gio.File.new_for_path(userProfilePicture);

        if (!file.query_exists(null)) {
            return defaultAvatar;
        }

        try {
            const pixbuf = GdkPixbuf.Pixbuf.new_from_file(userProfilePicture);

            if (pixbuf) {
                return userProfilePicture;
            }
        } catch (error) {
            console.error(`Failed to load image from ${userProfilePicture}: ${error}`);
        }

        return defaultAvatar;
    }

    /**
     * Sets the userName to the next user in the users array.
     * If the current user is the last in the array, it wraps around to the first user.
     */
    public getNextUser(): void {
        const indexOfCurrentUser = this.users.indexOf(this.userName.value);
        const totalUsers = this.users.length;
        const nextUserIndex = (indexOfCurrentUser + 1) % totalUsers;

        this.userName.value = this.users[nextUserIndex];
    }

    /**
     * Sets the userName to the previous user in the users array.
     * If the current user is the first in the array, it wraps around to the last user.
     */
    public getPrevUser(): void {
        const indexOfCurrentUser = this.users.indexOf(this.userName.value);
        const totalUsers = this.users.length;
        const prevUserIndex = (indexOfCurrentUser - 1 + totalUsers) % totalUsers;

        this.userName.value = this.users[prevUserIndex];
    }

    /**
     * Logs in the user with the provided password and session execution command.
     *
     * @returns A promise that resolves when the login process is complete.
     */
    async login(): Promise<void> {
        this.loggingIn.value = true;

        if (this.currentSession.value.length === 0) {
            return;
        }

        return greetd.login(this.userName.value, this.password.value, this.currentSession.value[1]).catch((res) => {
            this.loggingIn.value = false;
            this.password.value = '';

            return res?.description || JSON.stringify(res);
        });
    }
}

const loginSession = await LoginSession.create();
export default loginSession;
