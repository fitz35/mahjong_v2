
/**
 * a custom error class
 */
export abstract class CustomException extends Error{
    constructor(public readonly title : string, message: string){
        super(message);
        this.name = this.constructor.name;
        //Error.captureStackTrace(this, this.constructor);
    }
}