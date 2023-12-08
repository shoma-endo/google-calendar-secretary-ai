"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTextUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const line_util_1 = require("~/utils/line.util");
const util_1 = require("~/utils/util");
const messageTextUsecase = async (event) => {
    try {
        const { text } = event.message;
        await line_client_1.lineClient.replyMessage(event.replyToken, (0, line_util_1.makeReplyMessage)(text));
    }
    catch (err) {
        (0, util_1.errorLogger)(err);
        throw new Error('message text Usecase');
    }
};
exports.messageTextUsecase = messageTextUsecase;
