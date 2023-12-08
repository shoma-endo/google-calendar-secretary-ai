"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgError = exports.msgOther = void 0;
exports.msgOther = {
    type: 'text',
    text: 'テキスト以外のメッセージを受信しました'
};
exports.msgError = {
    type: 'flex',
    altText: 'エラーが発生しました',
    contents: {
        type: 'bubble',
        direction: 'ltr',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: 'エラーが発生しました',
                    align: 'start',
                    wrap: true
                }
            ]
        },
        footer: {
            type: 'box',
            layout: 'horizontal',
            contents: [
                {
                    type: 'button',
                    action: {
                        type: 'uri',
                        label: '報告する',
                        uri: 'https://twitter.com/hyodoblog'
                    },
                    style: 'primary'
                }
            ]
        }
    }
};
