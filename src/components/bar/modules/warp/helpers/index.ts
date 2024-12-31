import { execAsync, Variable } from "astal";

export const isWarpConnectCommand = `bash -c "warp-cli status | awk {'print $3'}"`
export const isWarpDisconnectCommand = `bash -c "warp-cli status | head -1 | awk {'print $3'}"`

export const isWarpConnect = Variable(false);

export const toggleWarp = async (isWarpConnect: Variable<boolean>): Promise<void> => {
    try {
        await execAsync(`bash -c "warp-cli ${isWarpConnect.get() ? 'disconnect' : 'connect'}"`);
        
        const res = await execAsync(isWarpConnect.get() ? isWarpConnectCommand : isWarpDisconnectCommand);
        isWarpConnect.set(isWarpConnect.get() ? res === 'Disconnected' : res === 'Connected');
    } catch (err) {
        await execAsync(`bash -c "notify-send -a 'hyprpanel' 'Warp service not active!' 'Error: ${err}'"`);
    }
};

export const checkWarpStatus = (): undefined => {
    execAsync(isWarpConnectCommand).then((res) => {
        isWarpConnect.set(res === 'Connected');
    });
};
