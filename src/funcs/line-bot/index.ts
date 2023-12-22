import { middleware } from '@line/bot-sdk'
import express from 'express'

import { lineMiddlewareConfig } from '~/clients/line.client'

import { usecases } from './usecases'
import { getAccessToken } from './usecases/calendars';

const app = express()

app.post('/webhook', middleware(lineMiddlewareConfig), (req, res) => {
  Promise
    .all(req.body.events.map(usecases))
    .then((result) => {
      // アプリケーションの初期化時にアクセストークンを取得
      let text = '';
      getAccessToken().then(accessToken => {
        text = accessToken as any;
        // ここで accessToken を使用するロジックを実装
      }).catch(error => {
        console.error('Error during access token retrieval:', error);
      });
      res.json(text)
      res.status(200).end()
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
