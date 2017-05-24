import {BadRequestError} from "routing-controllers";

/**
 * Thrown when criteria is required, but was missing in a user request.
 */
export class CriteriaRequiredError extends BadRequestError {

    name = "CriteriaRequiredError";

    constructor(criteriaName: string, method: string, route: string) {
        super();
        Object.setPrototypeOf(this, CriteriaRequiredError.prototype);
        this.message = `Criteria "${criteriaName}" is required for request on ${method.toUpperCase()} ${route}`;
    }

}