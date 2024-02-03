// server side code:

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const CLIENT_ID = process.env['CLIENT_ID']
// const CLIENT_SECRET = process.env['CLIENT_SECRET']

const port = 8000; // Define a port number

const server = http.createServer((req, res) => {
  console.log("connected")
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows access from any origin
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST'); // Specify methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify headers
  if (req.url === '/start-oauth') {
      console.log("start-oath")
      // Handle OAuth initiation
      initiateOAuthFlow(res);
  } else if (req.url.startsWith('/oauth2callback')) {
    console.log("call back")
      // Handle OAuth callback
      handleOAuthCallback(req, res);
  } else {
      console.log("else")
      // Serve the HTML file for the root path
      serveHTML(res);
  }
});

function initiateOAuthFlow(res) {
  console.log("intitiate oauth flow")
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  // Create the OAuth request URL
  let authUrl = `${oauth2Endpoint}?client_id=${CLIENT_ID}&response_type=code`;
  authUrl += `&scope=${encodeURIComponent('https://googleapis.com/auth/calendar.events.readonly')}`;
  authUrl += `&redirect_uri=${encodeURIComponent('https://nlkniblfkjabepenbpffopnfkmooekej.chromiumapp.org/')}`;
  authUrl += `&prompt=consent`;
  authUrl += `&access_type=offline`;

  // Send the authUrl back to the client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(authUrl);
  console.log("authUrl: ", authUrl)

  console.log("should send authurl back to client")
  }

// function handleOAuthCallback(req, res) {
//   console.log("exchange Auth Code for Token")
//   const code = req
//   const tokenEndpoint = 'https://oauth2.googleapis.com/token';
//   const data = new URLSearchParams({
//     client_id: CLIENT_ID,
//     // client_secret: CLIENT_SECRET,
//     code: code,
//     grant_type: 'authorization_code',
//     redirect_uri: chrome.identity.getRedirectURL()
//   })

//   // Send the Token url data back to the client
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end(data);
//   console.log("data: ", data)
//   console.log("should send token url data back to client")
// }

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});