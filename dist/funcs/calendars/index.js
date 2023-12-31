"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserTokens = exports.saveUserTokens = exports.authUrl = exports.oauth2Client = exports.userTokens = void 0;
const googleapis_1 = require("googleapis");
const secrets_1 = require("../../utils/secrets");
exports.userTokens = {};
const OAuth2 = googleapis_1.google.auth.OAuth2;
exports.oauth2Client = new OAuth2(secrets_1.GOOGLE_OAUTH_CLIENT_ID, secrets_1.GOOGLE_OAUTH_SECRET, secrets_1.APP_URL + "/callback");
exports.authUrl = exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
});
const saveUserTokens = async (code) => {
    const response = await exports.oauth2Client.getToken(code);
    const tokens = response.tokens;
    exports.userTokens = tokens;
    console.log(exports.userTokens);
};
exports.saveUserTokens = saveUserTokens;
const deleteUserTokens = () => {
    exports.userTokens = {};
};
exports.deleteUserTokens = deleteUserTokens;
