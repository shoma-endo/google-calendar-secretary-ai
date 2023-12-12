import { MessageEvent, TextEventMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { makeReplyMessage } from '~/utils/line.util'

// *********
// main関数
// *********

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
  try {
    const { text } = event.message as TextEventMessage

    await lineClient.replyMessage(event.replyToken, makeReplyMessage(text))
  } catch {
    throw new Error('message text Usecase')
  }
}
