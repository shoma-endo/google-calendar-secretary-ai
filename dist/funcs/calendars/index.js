"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserTokens = exports.saveUserTokens = exports.authUrl = exports.oauth2Client = exports.userTokens = void 0;
const googleapis_1 = require("googleapis");
const secrets_1 = require("../../utils/secrets");
let userTokens = {};
exports.userTokens = userTokens;
const OAuth2 = googleapis_1.google.auth.OAuth2;
const oauth2Client = new OAuth2(secrets_1.GOOGLE_OAUTH_CLIENT_ID, secrets_1.GOOGLE_OAUTH_SECRET, secrets_1.APP_URL + "/callback");
exports.oauth2Client = oauth2Client;
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
});
exports.authUrl = authUrl;
async function saveUserTokens(code) {
    const response = await oauth2Client.getToken(code);
    const tokens = response.tokens;
    exports.userTokens = userTokens = tokens;
    console.log(userTokens);
}
exports.saveUserTokens = saveUserTokens;
function deleteUserTokens() {
    exports.userTokens = userTokens = {};
}
exports.deleteUserTokens = deleteUserTokens;
