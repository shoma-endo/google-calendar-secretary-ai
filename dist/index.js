"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./alias");
if (!process.env.FUNCTION_TARGET || process.env.FUNCTION_TARGET === 'lineBot') {
    exports.lineBot = require('./funcs/line-bot');
}
