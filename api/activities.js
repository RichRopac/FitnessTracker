const express = require('express');
const router = express.Router();
const { getAllActivities } = require("../db");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
   
    try {
        res.send(await getAllActivities());
      } catch ({ name, message }) {
        next({ name, message });
      }
    });

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
