"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenaiMessage = void 0;
const openai_client_1 = require("~/clients/openai.client");
const apis_1 = require("../calendars/apis");
const apis_2 = require("../calendars/apis");
const apis_3 = require("../calendars/apis");
const getOpenaiMessage = async (text) => {
    if (text.includes('登録')) {
        const registrationJson = await registrationJsonGeneration(text);
        if (registrationJson === null) {
            throw new Error('openaiResponse is null');
        }
        return await (0, apis_1.insertCalendar)(registrationJson);
    }
    else if (text.includes('更新')) {
    }
    else if (text.includes('取得')) {
        return await (0, apis_1.fetchGoogleCalendarEvents)();
    }
    else if (text.includes('削除')) {
        if (text.trim() === '削除') {
            return await (0, apis_2.fetchGoogleCalendarEventsForDeletion)();
        }
        else {
            const eventNumber = parseInt(text.replace('削除', ''));
            if (isNaN(eventNumber)) {
                return '有効なイベント番号を入力してください。';
            }
            return await (0, apis_3.deleteEventByNumber)(eventNumber);
        }
    }
    return 'もう一度文章送って';
};
exports.getOpenaiMessage = getOpenaiMessage;
const registrationJsonGeneration = async (text) => {
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": 'Assistant to create Google calendar api registration request parameters. Please create them based on the instructions from the user. If there are any missing instructions, please tell us each time in Japanese only.' },
            { "role": "user", "content": 'Please create the request parameters for calendar registration according to the following request. Time zone should be Japan time.' + text },
        ],
        model: "gpt-4",
        response_format: { "type": "json_object" }
    });
    return completion.choices[0].message.content;
};
