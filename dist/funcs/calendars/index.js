"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserTokens = exports.authUrl = exports.oauth2Client = exports.userTokens = void 0;
const google_auth_library_1 = require("google-auth-library");
const secrets_1 = require("../../utils/secrets");
exports.userTokens = {};
const oauth2Client = new google_auth_library_1.OAuth2Client(secrets_1.GOOGLE_OAUTH_CLIENT_ID, secrets_1.GOOGLE_OAUTH_SECRET, secrets_1.APP_URL + "/callback");
exports.oauth2Client = oauth2Client;
const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
});
exports.authUrl = authUrl;
async function saveUserTokens(req) {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    const userId = 'some-unique-user-id';
    exports.userTokens[userId] = tokens;
    console.log(tokens);
}
exports.saveUserTokens = saveUserTokens;
