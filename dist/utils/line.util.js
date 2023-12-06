"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReplyMessage = void 0;
const makeReplyMessage = (text) => {
    return {
        type: 'text',
        text: text.replace(/<br>/g, '\n')
    };
};
exports.makeReplyMessage = makeReplyMessage;
