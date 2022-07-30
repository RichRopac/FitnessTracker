/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, getUserById, getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode")
const { requireUser } = require('./utilities');
// May not be necessary? a.t.
router.use((req, res, next) => {
  console.log("A request is being made to /users");
  next();
});
// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  // check password length for being too shortclea
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
router.get("/:username/routines", async (req, res, next) => {
    // console.log("WHAT ARE WE GETTING: ", getPublicRoutinesByUser());
    try {
      const username = req.params.username;
      let routine = [];
      //Get the token sent in for logged in user
      const auth = req.header("Authorization");
      console.log("THIS IS THE TOKEN SENT IN: ", auth)
      
      //Decode the token to get logged in user.id
      const decoded = jwt_decode(auth)
      console.log(" THIS IS DECODED: ", decoded.id)
      
      const loggedUser = await getUserById(decoded.id)
      console.log("THIS IS THE LOGGED IN USER: ",loggedUser.username)
      console.log("USERNAME TEST ", username);
      
      if (username === loggedUser.username){
        routine = await getAllRoutinesByUser({ username });
      } else {
        routine = await getPublicRoutinesByUser({ username });
      }

      res.send(routine);

    } catch (error) {
      next(error);
    }
  });
  
  module.exports = router;
  