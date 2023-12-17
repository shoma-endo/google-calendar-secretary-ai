"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_API_KEY = exports.LINE_SECRET = exports.LINE_ACCESS_TOKEN = void 0;
require("dotenv/config");
exports.LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
exports.LINE_SECRET = process.env.LINE_SECRET;
exports.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
