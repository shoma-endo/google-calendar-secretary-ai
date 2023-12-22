import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
    keyFile: "../../../../credentials.json",
    scopes: "https://www.googleapis.com/auth/calendar"
});

async function getAccessToken() {
    try {
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

export { getAccessToken };