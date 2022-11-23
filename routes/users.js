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

router.get("/user-info/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const foodsRef = db.collection("users").doc(id);
    const response = await foodsRef.get();

    res.send(response.data());
  } catch (e) {
    res.send(e);
  }
});

router.post("/edit-user", async function (req, res, next) {
  try {
    const id = req.body.id;
    const username = req.body.username;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

    const usersRef = await db.collection("users").doc(id);
    usersRef.update({
      username,
      email,
      password,
    });

    res.statusCode = 200;
    res.send({
      id,
      username,
      email,
      password,
    });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
