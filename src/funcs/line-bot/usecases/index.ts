import { WebhookEvent } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { msgError } from '~lineBot/notice-messages/other'

import { followUsecase } from './follow'
import { messagesUsecase } from './messages'

export const usecases = async (event: WebhookEvent): Promise<void> => {
  try {
    switch (event.type) {
      case 'follow':
        return await followUsecase(event)
      case 'message':
        return await messagesUsecase(event)
      default:
    }
  } catch {
    lineClient.pushMessage(event.source.userId!, msgError).catch
    throw new Error('usecases')
  }
}
