var express = require("express");
const fire = require("../config");
const bcrypt = require("bcrypt");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = fire.firestore();

router.post("/signup", async function (req, res, next) {
  try {
    const id = uuidv4();
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const passHash = bcrypt.hashSync(password, 10);

    const usersRef = db.collection("users");
    const query = usersRef.where("username", "==", username);
    const result = await query.get();

    console.log({ email, password, username });

    if (result.empty) {
      const userJson = {
        id: id,
        email: email,
        username: username,
        password: passHash,
      };

      db.collection("users").doc(id).set(userJson);
      res.statusCode = 200;
      res.send({ result: userJson });
    } else {
      res.statusCode = 401;
      res.send({ message: "Username already exists" });
    }
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
        res.statusCode = 200;
        res.send({ result: response });
      } else {
        res.statusCode = 401;
        res.send({ message: "Password not match" });
      }
    } else {
      res.statusCode = 401;
      res.send({ message: "Username not found" });
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
