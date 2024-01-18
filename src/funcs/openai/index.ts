import { openai } from '~/clients/openai.client'

import { fetchGoogleCalendarEvents, insertCalendar } from '../calendars/apis'
import { fetchGoogleCalendarEventsForDeletion } from '../calendars/apis'
import { deleteEventByNumber } from '../calendars/apis'

export const getOpenaiMessage = async (text: string): Promise<string> => {
  if (text.includes('登録')) {
    const registrationJson = await registrationJsonGeneration(text);
    if (registrationJson === null) {
      throw new Error('openaiResponse is null')
    }
    return await insertCalendar(registrationJson);
  }
  else if (text.includes('更新')) {
    // 更新処理関数
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

const registrationJsonGeneration = async (text: string): Promise<string | null> => {
	const completion = await openai.chat.completions.create({
    messages: [
			{"role": "system", "content": 'Assistant to create Google calendar api registration request parameters. Please create them based on the instructions from the user. If there are any missing instructions, please tell us each time in Japanese only.'},
      {"role": "user", "content": 'Please create the request parameters for calendar registration according to the following request. Time zone should be Japan time.' + text },
		],
    model: "gpt-4",
    response_format: { "type": "json_object" }
  });
  return completion.choices[0].message.content;
}
