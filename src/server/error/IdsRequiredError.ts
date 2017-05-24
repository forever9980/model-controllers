import {BadRequestError} from "routing-controllers";

/**
 * Thrown when ids are required, but was missing in a user request.
 */
export class IdsRequiredError extends BadRequestError {

    name = "IdsRequiredError";

    constructor(method: string, route: string) {
        super();
        Object.setPrototypeOf(this, IdsRequiredError.prototype);
        this.message = `Ids parameter is required for request on ${method.toUpperCase()} ${route}`;
    }

}