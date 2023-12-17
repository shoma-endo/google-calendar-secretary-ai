"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = __importDefault(require("express"));
const line_client_1 = require("~/clients/line.client");
const usecases_1 = require("./usecases");
const app = (0, express_1.default)();
app.post('/webhook', (0, bot_sdk_1.middleware)(line_client_1.lineMiddlewareConfig), (req, res) => {
    Promise
        .all(req.body.events.map(usecases_1.usecases))
        .then((result) => {
        res.json(result);
        res.status(200).end();
    })
        .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
