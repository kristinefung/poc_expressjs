import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET_KEY || "";

type JwtPayload = {
    userId: number,
    roleId: number,
    exp: number,
}

export async function hashPassword(plainPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return hashedPassword;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const correct = await bcrypt.compare(plainPassword, hashedPassword)

    return correct
}

export function generateUserSessionToken(userId: number, roleId: number): string {
    // Step 1: Sign JWT
    const payload: JwtPayload = {
        userId: userId,
        roleId: roleId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3) // Token expires in 3 hours
    };

    const token = jwt.sign(payload, secretKey);

    return token;
};

export function verifyUserSessionToken(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload; // Verify and decode the token
        return decoded; // Returns the payload if valid
    } catch (error) {
        console.error('Token verification failed:', error);
        return null; // Return null or handle the error as needed
    }
}