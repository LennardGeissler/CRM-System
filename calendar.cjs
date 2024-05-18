require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { resolvePath } = require('react-router-dom');

const client_id = "934908207638-5rpiji2e1le78kjpearsj346439ljevq.apps.googleusercontent.com";
const secret_id = "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";
const redirect = "http://localhost:3001/redirect";

const app = express();
const oauth2Client = new google.auth.OAuth2(client_id, secret_id, redirect);

app.get('/', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    res.redirect(url);
})

app.get('/redirect', (req, res) => {
    const code = req.query.code;
    oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
            console.error('Could not get token', err);
            res.send('Error');
            return;
        }
        oauth2Client.setCredentials(tokens);
        res.send('Successfully logged in');
    });
})

app.get('/calendars', (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    calendar.calendarList.list({}, (err, response) => {
        if (err) {
            console.error('Error fetching calendars', err);
            res.end('Error!')
            return;
        }
        const calendars = response.data.items;
        res.json(calendars);
    });
})

app.get('/events', (req, res) => {
    const calendarId = req.query.calendar ?? 'primary';
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    calendar.events.list({
        calendarId,
        timeMin: (new Date()).toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime'
    }, (err, response) => {
        if (err) {
            console.error('Cannot fetch events', err);
            res.send('Error');
            return;
        }
        const events = response.data.items;
        res.json(events);
    })
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});