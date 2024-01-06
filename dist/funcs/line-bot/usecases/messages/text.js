"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTextUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const openai_1 = require("~/funcs/openai");
const line_util_1 = require("~/utils/line.util");
const calendars_1 = require("../../../calendars");
const messageTextUsecase = async (event) => {
    try {
        const currentTime = new Date().getTime();
        if (typeof calendars_1.userTokens?.expiry_date === 'number' && calendars_1.userTokens?.expiry_date <= currentTime)
            calendars_1.deleteUserTokens;
        if (Object.keys(calendars_1.userTokens).length === 0) {
            await line_client_1.lineClient.replyMessage(event.replyToken, (0, line_util_1.makeReplyMessage)(calendars_1.authUrl));
            return;
        }
        const { text } = event.message;
        const response = await (0, openai_1.getOpenaiMessage)(text);
        if (response === null) {
            throw new Error('openaiResponse is null');
        }
        console.log(response);
        await line_client_1.lineClient.replyMessage(event.replyToken, (0, line_util_1.makeReplyMessage)(response));
    }
    catch {
        throw new Error('message text Usecase');
    }
};
exports.messageTextUsecase = messageTextUsecase;
