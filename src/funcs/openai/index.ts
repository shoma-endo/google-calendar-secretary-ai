import { openai } from '~/clients/openai.client'

import { fetchGoogleCalendarEvents, insertCalendar, updateCalendar } from '../calendars/apis'
import { fetchGoogleCalendarEventsForDeletion } from '../calendars/apis'
import { deleteEventByNumber } from '../calendars/apis'

export const getOpenaiMessage = async (text: string): Promise<string> => {
  if (text.includes('登録')) {
    const registrationJson = await calendarJsonGeneration(text);
    if (registrationJson === null) {
      throw new Error('openaiResponse is null')
    }
    console.log(registrationJson); // eslint-disable-line no-console
    return await insertCalendar(registrationJson);
  }
  else if (text.includes('更新')) {
    const updateJson = await calendarJsonGeneration(text);
    if (updateJson === null) {
      throw new Error('openaiResponse is null')
    }
    return await updateCalendar(text, updateJson);
  }
  else if (text.includes('取得')) {
    return await fetchGoogleCalendarEvents();
  }
  else if (text.includes('削除')) {
    // 「削除」というメッセージの場合は、イベント一覧を表示
    if (text.trim() === '削除') {
      return await fetchGoogleCalendarEventsForDeletion();
    } 
    // 「削除[イベント番号]」の場合は、指定されたイベントを削除
    else {
      const eventNumber = parseInt(text.replace('削除', ''));
			if (isNaN(eventNumber)) {
				return '有効なイベント番号を入力してください。';
			}
			return await deleteEventByNumber(eventNumber);
		}
  }
  return 'もう一度文章送って';
}

const calendarJsonGeneration = async (text: string): Promise<string | null> => {
	const completion = await openai.chat.completions.create({
    messages: [
			{"role": "system", "content": 'You are the text formatting assistant. Parses the Google Calendar event API request parameters in JSON format for the string provided by the user. The timeZone of the JSON key should be Asia/Tokyo.'},
      {"role": "user", "content": text },
		],
    model: "gpt-3.5-turbo-1106",
    response_format: { "type": "json_object" }
  });
  return completion.choices[0].message.content;
}
