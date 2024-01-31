document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded");
});

// user clicks buttons
document.getElementById('signin_button').addEventListener('click', function() {
    console.log("Sign in calendar button clicked");
    chrome.runtime.sendMessage({ action: "userSignIn" });
});
document.getElementById('goto_calendar').addEventListener('click', function() {
    console.log("Go to calendar button clicked");
    window.open("https://calendar.google.com/calendar/u/0/r/week", "_blank");
});
document.getElementById('signout_button_c').addEventListener('click', function() {
  console.log("sign out calendar button clicked");
});
document.getElementById('signout_button_g').addEventListener('click', function() {
    console.log("sign out Google button clicked");
    signOutAllGoogle();
});