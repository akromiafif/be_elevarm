var firebase = require("firebase-admin");
var credentials = require("./key.json");

var fire = firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
});

module.exports = fire;
