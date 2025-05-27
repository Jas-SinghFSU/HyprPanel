export function parseCommandOutputJson(moduleName: string, cmdOutput: unknown): Record<string, unknown> {
    try {
        if (typeof cmdOutput !== 'string') {
            throw new Error('Input must be a string');
        }

        return JSON.parse(cmdOutput);
    } catch {
        throw new Error(`The command output for the following module is not valid JSON: ${moduleName}`);
    }
}
