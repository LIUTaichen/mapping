var CLIENT_ID = '676408930964-2pvbodm5bmn2ehdq54ilsg6r10lvukb7.apps.googleusercontent.com';
//var CLIENT_ID ='676408930964-1lkbkp4ri2k3p3shv1daa71b7rvbvh6m.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDYeRC_Z2a9UrBLHaQ6yfgUilQZukYiYrA';
//var API_KEY = '1ZfA3O9hBD9jN2_uOF1cD01G';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var plants;
var projects;
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    //listMajors();
    var plants = getPlantList();
    console.log(plants);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}



/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */

 var plants;
function listMajors() {
    var result;
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1CMfkJYXH5mbUvn9F-SzN4TIxoxn1macPcVKRzxbLfuw',
    range: 'Plants!A2:AQ',
  }).then(function(response) {
    var range = response.result;
    result = range;
    plants = range;
    console.log(range.values.length);
    processPlants(result);
    // if (range.values.length > 0) {
    //   appendPre('Name, Major:');
    //   for (i = 0; i < range.values.length; i++) {
    //     var row = range.values[i];
    //     // Print columns A and E, which correspond to indices 0 and 4.
    //     appendPre(row[0] + ', ' + row[4]);
    //   }
    // } else {
    //   appendPre('No data found.');
    // }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
  console.log(result);

}
console.log(plants);




  /**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


function getPlantList () {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '16VdfZZNiHPtd9f6MkXjOhXMrvXtTBRZ2wazjracgYkw',
    range: 'Plants!A1:AQ',
  }).then(function(response) {
    var range = response.result;
   
    console.log(range.values.length);
    plants = convertRowToObject(range);
    getProjectList();

  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });

}
function getProjectList () {
    console.log(plants);
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '16VdfZZNiHPtd9f6MkXjOhXMrvXtTBRZ2wazjracgYkw',
    range: 'Projects!A1:T',
  }).then(function(response) {
    var range = response.result;
   
    console.log(range.values.length);
    projects = convertRowToObject(range);
    processData();
   
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });

}