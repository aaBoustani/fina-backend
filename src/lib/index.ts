import { logger } from './logger';


class BackendError extends Error {
    functionName: string | undefined;

    constructor(message: string) {
        super(message);
        this.name = "BackendError";
        this.functionName = this.getFunctionName();

        logger.error(`${this.functionName}: ${this.message}`);

        Object.setPrototypeOf(this, new.target.prototype);
    }

    private getFunctionName(): string | undefined {
        const errorObj = new Error();
        const callerFunctionLine = errorObj.stack?.split("\n")[3];
        if (callerFunctionLine) {
            const functionNameMatch = callerFunctionLine.trim().match(/\((.+)\)/);
            if (functionNameMatch) {
                return functionNameMatch[1];
            }
        }
        return undefined;
    }
}


export * from './logger';
export {
    BackendError,
};
