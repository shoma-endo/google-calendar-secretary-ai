import { MessageEvent, TextEventMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { openai } from '~/clients/openai.client'
import { makeReplyMessage } from '~/utils/line.util'

import { authUrl, deleteUserTokens,userTokens } from '../../../calendars';

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
  console.log(event.message); // eslint-disable-line no-console
	try {
    const currentTime = new Date().getTime();
    // 有効期限のチェック
    if (typeof userTokens?.expiry_date === 'number' && userTokens?.expiry_date <= currentTime) deleteUserTokens;
    // オブジェクトが空かチェック
    if (Object.keys(userTokens).length === 0) {
      // Google認証済みでなければLINEで認証URLを返答する
      await lineClient.replyMessage(event.replyToken, makeReplyMessage(authUrl));
      return;
    }

    const { text } = event.message as TextEventMessage
		const response = await getOpenaiMessage(text);
		if (response === null) {
			throw new Error('openaiResponse is null');
		}

    await lineClient.replyMessage(event.replyToken, makeReplyMessage(response))
  } catch {
    throw new Error('message text Usecase')
  }
}

const getOpenaiMessage = async (text: string): Promise<string | null> => {
	const completion = await openai.chat.completions.create({
    messages: [
			{"role": "system", "content": "You are the assistant who makes the request parameters for the Google calendar api."},
      {"role": "user", "content": text}
		],
    model: "gpt-4",
  });
  return completion.choices[0].message.content;
}
