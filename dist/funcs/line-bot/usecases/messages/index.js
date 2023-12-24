"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const other_1 = require("~lineBot/notice-messages/other");
const text_1 = require("./text");
const messagesUsecase = async (event) => {
    console.log(event.message.type);
    try {
        switch (event.message.type) {
            case 'text':
                return await (0, text_1.messageTextUsecase)(event);
            default:
                await line_client_1.lineClient.replyMessage(event.replyToken, other_1.msgOther);
        }
    }
    catch {
        throw new Error('messages Usecase');
    }
};
exports.messagesUsecase = messagesUsecase;
