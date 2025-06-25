export function env<T = any>(envName: string, defaultValue: T) {
    return process.env[envName] ?? defaultValue;
}

env.Int = (envName: string, defaultValue: number): number => {
    return +env(envName, defaultValue);
};

env.String = (envName: string, defaultValue = ''): string => {
    return env(envName, defaultValue);
};