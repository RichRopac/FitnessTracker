/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {createUser, getUser, getUserByUsername} = require("../db/users")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env

// POST /api/users/register

router.post("/register", async (req, res, next) => {
    try {
       const { username, password } = req.body
       // for end user exists in our database return message
        if (getUserByUsername(username))
        {
        res.send({ message: "Username is Already Taken"})
        }  
       // check password length for being too short
        else if (
           password.length < 8){
            res.send({ message: "Password Length is too Short"})
        } 
       //another else;
       else {
         createUser(username, password)
       } 

    } catch (error) {
        console.log(error);
        next(error); 
    }
})

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
