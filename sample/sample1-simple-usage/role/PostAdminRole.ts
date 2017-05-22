import {RoleChecker} from "routing-controllers";

export class PostAdminRole implements RoleChecker {

    async check(user: any): Promise<boolean> {
        return true;
    }

}