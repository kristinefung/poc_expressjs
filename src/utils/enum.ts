
/************************************************************************
 *                           API related
 ************************************************************************/
export enum ApiStatusCode {
    SUCCESS = "SUCCESS",
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    TOO_MANY_LOGIN_ATTEMPTS = "TOO_MANY_LOGIN_ATTEMPTS",
    DATABASE_ERROR = "DATABASE_ERROR",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/************************************************************************
 *                           Database related
 ************************************************************************/
export enum StaffRole {
    ADMIN = 1,
    VIEWER = 2
}