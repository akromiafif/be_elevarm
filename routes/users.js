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

router.post("/login", async function (req, res, next) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const usersRef = db.collection("users");
    const query = usersRef.where("username", "==", username);
    const result = await query.get();

    if (!result.empty) {
      let response;

      result.forEach((doc) => {
        response = doc.data();
      });

      const isMatch = bcrypt.compareSync(password, response.password);

      if (isMatch) {
        res.send({ status: true, result: response });
      } else {
        res.send({ status: false, message: "Password not match" });
      }
    } else {
      res.send({ status: false, message: "Username not found" });
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
