"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccessToken = exports.saveUserTokens = exports.authUrl = exports.oauth2Client = exports.userTokens = void 0;
const googleapis_1 = require("googleapis");
const secrets_1 = require("../../utils/secrets");
exports.userTokens = {};
const OAuth2 = googleapis_1.google.auth.OAuth2;
exports.oauth2Client = new OAuth2(secrets_1.GOOGLE_OAUTH_CLIENT_ID, secrets_1.GOOGLE_OAUTH_SECRET, secrets_1.APP_URL + "/callback");
exports.authUrl = exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
}) + "&openExternalBrowser=1";
const saveUserTokens = async (code) => {
    const response = await exports.oauth2Client.getToken(code);
    exports.userTokens = response.tokens;
    exports.oauth2Client.setCredentials(exports.userTokens);
    console.log(exports.userTokens);
};
exports.saveUserTokens = saveUserTokens;
const updateAccessToken = async () => {
    try {
        const { credentials } = await exports.oauth2Client.refreshAccessToken();
        exports.userTokens = credentials;
        console.log(exports.userTokens);
    }
    catch {
        deleteUserTokens();
    }
};
exports.updateAccessToken = updateAccessToken;
const deleteUserTokens = () => {
    exports.userTokens = {};
    exports.oauth2Client.setCredentials({});
};
