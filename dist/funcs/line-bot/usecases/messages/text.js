"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTextUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const openai_client_1 = require("~/clients/openai.client");
const line_util_1 = require("~/utils/line.util");
const calendars_1 = require("../../../calendars");
const messageTextUsecase = async (event) => {
    console.log(event.message);
    try {
        const currentTime = new Date().getTime();
        if (typeof calendars_1.userTokens?.expiry_date === 'number' && calendars_1.userTokens?.expiry_date <= currentTime)
            calendars_1.deleteUserTokens;
        if (Object.keys(calendars_1.userTokens).length === 0) {
            await line_client_1.lineClient.replyMessage(event.replyToken, (0, line_util_1.makeReplyMessage)(calendars_1.authUrl));
            return;
        }
        const { text } = event.message;
        const response = await getOpenaiMessage(text);
        if (response === null) {
            throw new Error('openaiResponse is null');
        }
        await line_client_1.lineClient.replyMessage(event.replyToken, (0, line_util_1.makeReplyMessage)(response));
    }
    catch {
        throw new Error('message text Usecase');
    }
};
exports.messageTextUsecase = messageTextUsecase;
const getOpenaiMessage = async (text) => {
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": "You are the assistant who makes the request parameters for the Google calendar api." },
            { "role": "user", "content": text }
        ],
        model: "gpt-4",
    });
    return completion.choices[0].message.content;
};
