"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenaiMessage = void 0;
const openai_client_1 = require("~/clients/openai.client");
const getOpenaiMessage = async (text) => {
    if (text.includes('登録')) {
        return await registrationJsonGeneration(text);
    }
    else if (text.includes('更新')) {
    }
    else if (text.includes('取得')) {
    }
    else if (text.includes('削除')) {
    }
    return 'もう一度文章送って';
};
exports.getOpenaiMessage = getOpenaiMessage;
const registrationJsonGeneration = async (text) => {
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": 'Assistant to create Google calendar api registration request parameters. Please create them based on the instructions from the user. If there are any missing instructions, please tell us each time in Japanese only.' },
            { "role": "user", "content": 'Please create a request parameter for calendar registration according to the following request.' + text },
            { "role": "user", "content": 'If start time, end time, or title is missing, please tell us which one is missing in Japanese only. If all are met, please return only the json parameter. Time zone should be Japan time.' }
        ],
        model: "gpt-4",
    });
    return completion.choices[0].message.content;
};
