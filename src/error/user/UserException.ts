import { notification } from "antd";
import { CustomException } from "../CustomException";

export abstract class UserException extends CustomException {
    constructor(title : string, message: string) {
        super(title, message);
        this.name = this.constructor.name;
        //Error.captureStackTrace(this, this.constructor);
    }

    /**
     * show the error
     */
    openNotification(): void {
        notification["error"]({
            message: this.title,
            description: this.message,
        });
    }
}