import { MessageEvent, TextEventMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { getOpenaiMessage } from '~/funcs/openai'
import { makeReplyMessage } from '~/utils/line.util'

import { authUrl, updateAccessToken, userTokens } from '../../../calendars';

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
  try {
    const currentTime = new Date().getTime();
    // 有効期限のチェック
    if (typeof userTokens?.expiry_date === 'number' && userTokens?.expiry_date <= currentTime) {
      await updateAccessToken();
    }

    // オブジェクトが空かチェック
    if (Object.keys(userTokens).length === 0) {
      // Google認証済みでなければLINEで認証URLを返答する
      const message = "下記URLからGoogle認証を行なってください。\n" + authUrl;
      await lineClient.replyMessage(event.replyToken, makeReplyMessage(message));
      return;
    }

    const { text } = event.message as TextEventMessage
    const response = await getOpenaiMessage(text)
    if (response === null) {
      throw new Error('openaiResponse is null')
    }
    console.log(response) // eslint-disable-line no-console
    await lineClient.replyMessage(event.replyToken, makeReplyMessage(response))
  } catch {
    throw new Error('message text Usecase')
  }
}
