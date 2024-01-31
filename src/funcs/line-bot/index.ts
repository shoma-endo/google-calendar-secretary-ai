import { middleware } from '@line/bot-sdk'
import express from 'express'

import { lineMiddlewareConfig } from '~/clients/line.client'

import { saveUserTokens, sendGoogleMessage } from '../calendars';
import { usecases } from './usecases'

const app = express()

app.post('/webhook', middleware(lineMiddlewareConfig), (req, res) => {
  Promise
    .all(req.body.events.map(usecases))
    .then((result) => {
      res.json(result)
      res.status(200).end()
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/callback', (req, res) => {
  try {
    const code = req.query.code as string;
    const userId = req.query.state as string;
    saveUserTokens(code);
    sendGoogleMessage(userId);
    res.send('認証が完了しました。LINEに戻ってください。');
  } catch (error) {
    res.send('認証エラーが発生しました。再度ログインをし直してください。');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
