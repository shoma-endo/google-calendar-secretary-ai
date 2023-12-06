"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = void 0;
const firebase_functions_1 = require("firebase-functions");
const errorLogger = (err) => {
    if (err?.originalError?.response?.data)
        firebase_functions_1.logger.error(JSON.stringify(err.originalError.response.data));
    else if (err instanceof Error)
        firebase_functions_1.logger.error(err.message);
    else
        firebase_functions_1.logger.error(err);
};
exports.errorLogger = errorLogger;
