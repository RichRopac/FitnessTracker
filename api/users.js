/* eslint-disable no-useless-catch */
const express = require('express');
const router = express.Router();
const { createUser, getUser, getUserByUsername } = require('../db');
const jwt = require('jsonwebtoken');
const { requireUser } = require('./utils');

// May not be necessary? a.t.
router.use((req, res, next) => {
  console.log('A request is being made to /users');

  next();
});

// POST /api/users/register

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  // check password length for being too short
  if (password.length < 8) {
    next({
      name: 'PasswordTooShort',
      message: 'Password Length is too Short!',
      error: 'Error with password length..',
    });
  }

  // for end user exists in our database return message
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists',
        error: 'Error username already exists..',
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
      message: 'Thank you for signing up!',
      user,
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
