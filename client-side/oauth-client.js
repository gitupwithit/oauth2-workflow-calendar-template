// template for client-side script
// controls sign in, sign out and viewing of calendar

// user clicks sign in button
document.getElementById('signin_button').addEventListener('click', function() {
    console.log("Sign in calendar button clicked")
    initiateOAuth()
});
document.getElementById('goto_calendar').addEventListener('click', function() {
    console.log("Go to calendar button clicked")
    window.open("https://calendar.google.com/calendar/u/0/r/week", "_blank");
});
document.getElementById('signout_button_c').addEventListener('click', function() {
  console.log("sign out calendar button clicked")
});
document.getElementById('signout_button_g').addEventListener('click', function() {
    console.log("sign out Google button clicked")
    signOutAllGoogle()
});

// begin OAuth
function initiateOAuth() {
  console.log("client starting oauth")
  fetch('http://34.0.45.182:8000/start-oauth')
    .then(response => response.text())
    .then(authUrl => {
      console.log("authUrl: ", authUrl)
      window.open().location.href = authUrl; // Redirect the user to the auth URL
    })
    .catch(error => console.error('Error starting OAuth flow:', error));

    console.log("authorization rec")
    // Use the `launchWebAuthFlow` method to initiate the OAuth flow
    console.log("chrome:", chrome)
    console.log("chrome identity:", chrome.identity)
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function(redirectUrl) {
      console.log("redirect url:", redirectUrl)
      // Extract the authorization code from the redirect URL
    
      if (chrome.runtime.lastError || !redirectUrl) {
        // Handle error or user cancellation
        console.log("error: ", chrome.runtime.lastError)
        return;
      }
      const url = new URL(redirectUrl);
      const authorizationCode = url.searchParams.get('code');
      console.log("auth code:", authorizationCode)
      if (authorizationCode) {
        exchangeAuthorizationCodeForToken(authorizationCode);
      }
    })
  }

function exchangeAuthorizationCodeForToken(authorizationCode) {
  console.log("send to server for token")
  fetch('http://34.0.45.182:8000/oauth2callback', {
    method: 'POST', // or 'GET', depending on how your server expects to receive the data
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: authorizationCode }) // Send the authorization code in the request body

    .then(response => response.json())
    .then(data => {
      console.log("data: ", data)
        // Handle the response data (e.g., access token)
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
    })
  })
}


  

    // fetch(tokenEndpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: data
    // }).then(response => {
    //   return response.json();
    //   }).then(tokens => {
    //     console.log("save tokens now");
    //     // Save the tokens in chrome.storage.local
    //     chrome.storage.local.set({ 'access_token': tokens.access_token }, function() {
    //       if (chrome.runtime.lastError) {
    //         console.error('Error setting access_token:', chrome.runtime.lastError);
    //       } else {
    //         console.log('Access token saved successfully.');
    //         // fetchTodaysEvents(tokens.access_token).then(() => {
    //         //   fetchTomorrowsEvents(tokens.access_token).then(() => {
    //         //     fetchAppointments(tokens.access_token)
    //           // });
    //         // });
    //         }
    //         });
    //       if (tokens.refresh_token) {
    //         chrome.storage.local.set({ 'refresh_token': tokens.refresh_token }, function() {
    //           if (chrome.runtime.lastError) {
    //             console.error('Error setting refresh_token:', chrome.runtime.lastError);
    //           } else {
    //             console.log('Refresh token saved successfully.');
    //             fetchTodaysEvents(tokens.access_token).then(() => {
    //               fetchTomorrowsEvents(tokens.access_token).then(() => {
    //                 fetchAppointments(tokens.access_token);
    //             });
    //           })
    //         }
    //     });
    //   }
    // }).catch(error => {
    //   console.log("error saving tokens:", error)
    //   // Handle errors here
    // });
// }


// sign out of All Google accounts on browser

function signOutAllGoogle() {
    chrome.identity.launchWebAuthFlow(
      { 'url': 'https://accounts.google.com/logout' },
      function(tokenUrl) {
      // responseCallback();
      let emptyEvents = []
      chrome.runtime.sendMessage({ action: 'clearEvents' });
      }
    )
  }