import { MessageEvent } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { msgOther } from '~lineBot/notice-messages/other'

import { messageTextUsecase } from './text'

export const messagesUsecase = async (event: MessageEvent): Promise<void> => {
  try {
    switch (event.message.type) {
      case 'text':
        return await messageTextUsecase(event)
      default:
        await lineClient.replyMessage(event.replyToken, msgOther)
    }
  } catch {
    throw new Error('messages Usecase')
  }
}
