import { openai } from '~/clients/openai.client'

import { insertCalendar, updateCalendar, getEvents, deleteEvents } from '../calendars/apis'

export const getOpenaiMessage = async (text: string): Promise<string> => {
  if (text.includes('登録')) {
    const registrationJson = await calendarJsonGeneration(text);
    if (registrationJson === null) {
      throw new Error('openaiResponse is null')
    }
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
    const getEventJson = await fetchGoogleCalendarEventsGeneration(text);
    if (getEventJson === null) {
      throw new Error('openaiResponse is null')
    }
    return getEvents(getEventJson);
  }
  else if (text.includes('削除')) {
    const deleteEventJson = await fetchGoogleCalendarEventsGeneration(text);
    if (deleteEventJson === null) {
      throw new Error('openaiResponse is null')
    }
    return deleteEvents(deleteEventJson);
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

const fetchGoogleCalendarEventsGeneration = async (text: string): Promise<string | null> => {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": 'You are an assistant to fetch Google Calendar events. For the given string, parse the date and generate the Google Calendar API fetch request parameters in JSON format for that date.'},
      {"role": "user", "content": text },
    ],
    model: "gpt-3.5-turbo-1106",
    response_format: { "type": "json_object" }
  });
  return completion.choices[0].message.content;
}