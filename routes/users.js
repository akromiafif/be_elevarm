var express = require("express");
const fire = require("../config");
const bcrypt = require("bcrypt");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = fire.firestore();

router.post("/signup", function (req, res, next) {
  try {
    const id = uuidv4();
    const password = bcrypt.hashSync(req.body.password, 10);

    const userJson = {
      id: id,
      email: req.body.email,
      username: req.body.username,
      password: password,
    };

    const response = db.collection("users").doc(id).set(userJson);
    res.send(response);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
