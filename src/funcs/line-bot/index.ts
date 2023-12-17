import { middleware } from '@line/bot-sdk'
import express from 'express'

import { lineMiddlewareConfig } from '~/clients/line.client'

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
