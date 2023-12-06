"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = __importDefault(require("module-alias"));
const path_1 = require("path");
module_alias_1.default.addAliases({
    '~': (0, path_1.join)(__dirname, './'),
    '~lineBot': (0, path_1.join)(__dirname, './funcs/line-bot')
});
