"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineClient = exports.lineConfig = exports.lineMiddlewareConfig = void 0;
const bot_sdk_1 = require("@line/bot-sdk");
const secrets_1 = require("../utils/secrets");
exports.lineMiddlewareConfig = {
    channelSecret: secrets_1.LINE_SECRET
};
exports.lineConfig = {
    ...exports.lineMiddlewareConfig,
    channelAccessToken: secrets_1.LINE_ACCESS_TOKEN
};
exports.lineClient = new bot_sdk_1.Client(exports.lineConfig);
