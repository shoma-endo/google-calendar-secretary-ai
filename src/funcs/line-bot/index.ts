import { MessageEvent, middleware } from '@line/bot-sdk'
import express from 'express'

import { lineClient, lineConfig } from '~/clients/line.client'

const app = express()

app.post('/webhook', middleware(lineConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const handleEvent = async (event: MessageEvent) => {
	if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}
