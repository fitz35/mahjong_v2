/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export class MyLogger {
    static debug(message: string, ...optionalParams: any[]): void {
        console.trace();
        console.debug(message, ...optionalParams);
    }
    static log(message: string, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams);
    }
    static info(message: string, ...optionalParams: any[]): void {
        console.info(message, ...optionalParams);
    }
    static warn(message: string, ...optionalParams: any[]): void {
        console.warn(message, ...optionalParams);
    }
    static error(message: string, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams);
    }
}