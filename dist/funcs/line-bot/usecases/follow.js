"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUsecase = void 0;
const line_client_1 = require("~/clients/line.client");
const follow_1 = require("~lineBot/notice-messages/follow");
const followUsecase = async (event) => {
    await line_client_1.lineClient.replyMessage(event.replyToken, follow_1.msgFollow);
};
exports.followUsecase = followUsecase;
