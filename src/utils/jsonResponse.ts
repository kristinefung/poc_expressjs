import { Request, Response } from 'express';
import { ApiStatusCode } from './enum';
import * as Err from './err';

type FormattedResponse = {
    statusCode: string,
    traceId: string,
    message: string,
    data: object
}

function formattedResponse(statusCode: string, traceId: string, message: string, data: object): FormattedResponse {
    return {
        statusCode: statusCode,
        traceId: traceId,
        message: message,
        data: data
    };
}

export function jsonResponse(req: Request, res: Response, traceId: string, data: object, err?: any) {
    console.log(`traceId: ${traceId}, err: ${err}, req: ${req}, res: ${res}`);
    console.log(err);

    if (err instanceof Err.ApiError) {
        res.status(err.http_status).json(formattedResponse(err.status_code, traceId, err.message, data));
        return;
    }

    if (err instanceof Err.ZodError) {
        const errorMessage = err.issues[0].message ?? 'Validation error';
        res.status(400).json(formattedResponse(ApiStatusCode.INVALID_ARGUMENT, traceId, errorMessage, data));
        return;
    }

    if (err instanceof Err.PrismaClientKnownRequestError) {
        res.status(500).json(formattedResponse(ApiStatusCode.DATABASE_ERROR, traceId, "Database error", data));
        return;
    }

    if (err instanceof Error) {
        console.log("==========> Error");
        res.status(500).json(formattedResponse(ApiStatusCode.SYSTEM_ERROR, traceId, "System error", data));
        return;
    }

    if (err) {
        console.log("==========> Unknown Error");
        res.status(500).json(formattedResponse(ApiStatusCode.UNKNOWN_ERROR, traceId, "An unknown error occurred", data));
        return;
    }

    res.status(200).json(formattedResponse(ApiStatusCode.SUCCESS, traceId, "Success", data));
    return;
}
