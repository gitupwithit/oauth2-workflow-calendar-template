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
  fetch('http://34.0.45.182:8000/start-oauth')
        .then(response => response.text())
        .then(authUrl => {
            window.location.href = authUrl; // Redirect the user to the auth URL
        })
        .catch(error => console.error('Error starting OAuth flow:', error));
}


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