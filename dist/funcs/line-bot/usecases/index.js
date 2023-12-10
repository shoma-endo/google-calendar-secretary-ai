"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usecases = void 0;
const line_client_1 = require("~/clients/line.client");
const other_1 = require("~lineBot/notice-messages/other");
const follow_1 = require("./follow");
const messages_1 = require("./messages");
const usecases = async (event) => {
    try {
        switch (event.type) {
            case 'follow':
                return await (0, follow_1.followUsecase)(event);
            case 'message':
                return await (0, messages_1.messagesUsecase)(event);
            default:
        }
    }
    catch (err) {
        line_client_1.lineClient.pushMessage(event.source.userId, other_1.msgError).catch;
        throw new Error('usecases');
    }
};
exports.usecases = usecases;
