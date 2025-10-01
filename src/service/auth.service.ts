import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { ApiStatusCode } from '../utils/enum';
import { ApiError } from '../utils/err';
import { verifyUserSessionToken } from '../utils/security';

export interface IAuthService {
    authUser(requiredRoleIds: number[], authHeader: string | undefined): Promise<number>;
}

@Service()
export class AuthService implements IAuthService {

    async authUser(requiredRoleIds: number[], authHeader: string | undefined): Promise<number> {
        const err = new ApiError("User has no permission", ApiStatusCode.UNAUTHORIZED, 401);

        // Step 1: Check is valid bear token
        if (typeof authHeader !== 'string') {
            console.error(`No token provided.`);
            throw err;
        }

        const tokenType = authHeader.split(' ')[0];
        if (tokenType !== 'Bearer') {
            console.error(`Not a valid bearer token: authHeader: ${authHeader}`);
            throw err;
        }

        const bearerToken = authHeader.split(' ')[1];

        // Step 2: Extract token payload data
        const jwtPayload = verifyUserSessionToken(bearerToken);
        if (!jwtPayload) {
            console.error(`Not a valid bearer token: bearerToken: ${bearerToken}`);
            throw err;
        }

        // Step 3: Check user role has permission
        if (requiredRoleIds.length > 0 && !requiredRoleIds.includes(jwtPayload.roleId!)) {
            console.error(`User role has no permission. Expected: ${requiredRoleIds}, Received: ${jwtPayload.roleId}`);
            throw err;
        }

        return jwtPayload.userId;

    }
}