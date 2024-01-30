// server side code:

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const CLIENT_ID = process.env['CLIENT_ID']
const CLIENT_SECRET = process.env['CLIENT_SECRET']

const port = 8000; // Define a port number

const server = http.createServer((req, res) => {
    console.log("connected")
    if (req.url === '/start-oauth') {
        console.log("start-oath")
        // Handle OAuth initiation
        initiateOAuthFlow(res);
    } else if (req.url.startsWith('/oauth2callback')) {
        // Handle OAuth callback
        handleOAuthCallback(req, res);
    } else {
        console.log("else")
        // Serve the HTML file for the root path
        serveHTML(res);
    }
});

function initiateOAuthFlow(res) {
    console.log("intitiate oauth flow, res:", res)
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Create the OAuth request URL
    let authUrl = `${oauth2Endpoint}?client_id=${CLIENT_ID}&response_type=code`;
    authUrl += `&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.events.readonly')}`;
    authUrl += `&redirect_uri=${encodeURIComponent('https://afppeaambpilopehbeonkbmgcjejhakm.chromiumapp.org/')}`;
    authUrl += `&prompt=consent`;
    authUrl += `&access_type=offline`;

    // Send the authUrl back to the client
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(authUrl);
  
    // Use the `launchWebAuthFlow` method to initiate the OAuth flow
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function(redirectUrl) {
      // Extract the authorization code from the redirect URL
      if (chrome.runtime.lastError || !redirectUrl) {
        // Handle error or user cancellation
        console.log("error: ", chrome.runtime.lastError)
        return;
      }
      const url = new URL(redirectUrl);
      const authorizationCode = url.searchParams.get('code');
      if (authorizationCode) {
        exchangeAuthorizationCodeForToken(authorizationCode);
      }
    });
  }

function exchangeAuthorizationCodeForToken(code) {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const data = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: chrome.identity.getRedirectURL()
    });
  
    fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data
    }).then(response => {
      return response.json();
      }).then(tokens => {
        console.log("save tokens now");
        // Save the tokens in chrome.storage.local
        chrome.storage.local.set({ 'access_token': tokens.access_token }, function() {
          if (chrome.runtime.lastError) {
            console.error('Error setting access_token:', chrome.runtime.lastError);
          } else {
            console.log('Access token saved successfully.');
            fetchTodaysEvents(tokens.access_token).then(() => {
              fetchTomorrowsEvents(tokens.access_token).then(() => {
                fetchAppointments(tokens.access_token)
              });
            });
            }
            });
          if (tokens.refresh_token) {
            chrome.storage.local.set({ 'refresh_token': tokens.refresh_token }, function() {
              if (chrome.runtime.lastError) {
                console.error('Error setting refresh_token:', chrome.runtime.lastError);
              } else {
                console.log('Refresh token saved successfully.');
                fetchTodaysEvents(tokens.access_token).then(() => {
                  fetchTomorrowsEvents(tokens.access_token).then(() => {
                    fetchAppointments(tokens.access_token);
                });
              })
            }
        });
      }
    }).catch(error => {
      console.log("error saving tokens:", error)
      // Handle errors here
    });
  }

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});