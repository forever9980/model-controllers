import {BadRequestError} from "routing-controllers";

/**
 * Thrown when id is required, but was missing in a user request.
 */
export class IdRequiredError extends BadRequestError {

    name = "IdRequiredError";

    constructor(method: string, route: string) {
        super();
        Object.setPrototypeOf(this, IdRequiredError.prototype);
        this.message = `Id parameter is required for request on ${method.toUpperCase()} ${route}`;
    }

}