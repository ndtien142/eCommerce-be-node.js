"use strict";

const StatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
};

const ReasonStatusError = {
    CONFLICT: "Conflict request error",
    UNAUTHORIZED: "User not authenticated",
    BAD_REQUEST: "Bad request error",
    FORBIDDEN: "Forbidden error",
    NOT_FOUND: "Not found error",
    INTERNAL_SERVER_ERROR: "Internal server error",
};

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusError.CONFLICT,
        status = StatusCode.CONFLICT
    ) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusError.BAD_REQUEST,
        status = StatusCode.BAD_REQUEST
    ) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
};
