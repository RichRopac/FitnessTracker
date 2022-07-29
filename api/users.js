/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, getUser, getUserByUsername } = require("../db");
const jwt = require("jsonwebtoken");
const { requireUser } = require('./utilities');
// May not be necessary? a.t.
router.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});
// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  // check password length for being too short
  if (password.length < 8) {
    res.send({
      error: "Error with password length..",
      message: "Password Too Short!",
      name: "PasswordTooShort",
    });
  }
  // for end user exists in our database return message
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.send({
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
        error: "Error username already exists..",
      });
    }
    //another else;
    const user = await createUser({
      username,
      password,
    });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );
    res.send({
      message: "Thank you for signing up!",
      user,
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  // request must have both
  if (!username || !password) {
    res.send({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    
  const tempUser = await getUserByUsername(username);
  const hashedPassword = tempUser.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    let user = { id: tempUser.id, username: tempUser.username };
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );
    res.send({ 
        user, 
        message: "you're logged in!",
        token
   })} else {
      res.send({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.error("Error getting user by username, password..");
    next(error);
  }
});
// GET /api/users/me
router.get("/me", requireUser, async(req, res, next) => {

try {
    res.send(req.user)  
    
} catch (error) {
    next(error);
    
}

})








// GET /api/users/:username/routines
module.exports = router;