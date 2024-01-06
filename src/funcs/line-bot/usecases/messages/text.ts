import { MessageEvent, TextEventMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
// import { openai } from '~/clients/openai.client'
import { getOpenaiMessage } from '~/funcs/openai'
import { makeReplyMessage } from '~/utils/line.util'
import { authUrl, userTokens, deleteUserTokens } from '../../../calendars';

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
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
