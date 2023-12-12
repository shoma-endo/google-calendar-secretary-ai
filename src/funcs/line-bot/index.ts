import { middleware } from '@line/bot-sdk'
import express from 'express'

import { lineMiddlewareConfig } from '~/clients/line.client'

import { usecases } from './usecases'

const app = express()

app.use(middleware(lineMiddlewareConfig))
app.post('/', (req, res) =>
  Promise.all(req.body.events.map(usecases))
    .then(() => {
      res.status(200).end()
    })
    .catch(() => {
      res.status(500).end()
    })
)

