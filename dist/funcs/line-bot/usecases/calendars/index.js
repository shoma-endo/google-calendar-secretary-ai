"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const auth = new google_auth_library_1.GoogleAuth({
    keyFile: "service-account-key.json",
    scopes: "https://www.googleapis.com/auth/calendar"
});
async function getAccessToken() {
    try {
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth: client });
        const start = '2023-12-20T00:00:00.000Z';
        const end = '2023-12-31T23:59:59.999Z';
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: start,
            timeMax: end,
            singleEvents: true,
            orderBy: 'startTime',
        });
        calendar.calendarList.list({}, (err, res) => {
            const calendars = res.data.items;
            console.log(calendars);
        });
        const calendarEntry = response.data;
        console.log(JSON.stringify(calendarEntry, null, 2));
        const events = response.data.items;
        if (!events || events.length === 0) {
            console.log('No upcoming events found.');
            return;
        }
        return accessToken;
    }
    catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}
exports.getAccessToken = getAccessToken;
