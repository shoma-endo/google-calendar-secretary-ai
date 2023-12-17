"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTextUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const openai_client_1 = require("~/clients/openai.client");
const line_util_1 = require("~/utils/line.util");
const messageTextUsecase = async (event) => {
    console.log(event.message);
    try {
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
