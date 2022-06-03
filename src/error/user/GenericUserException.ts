import { UserException } from "./UserException";

export class GenericUserException extends UserException{
    constructor(message: string) {
        super("Une erreur s'est produite.", message);
    }
}