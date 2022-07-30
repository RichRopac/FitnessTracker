const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, getActivityByName } = require("../db");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
   
    try {
        res.send(await getAllActivities());
      } catch (error) {
        next(error);
      }
    });

// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body
  // console.log("Req.BODY HERE ", req.body)
  try {
    const _activity = await getActivityByName(name)
    // console.log("this is a new activity ", name)
    if (_activity) {
      res.send({
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
        error: "Error Activity already exists..",
      });
    }else {
    const activity = await createActivity({ name, description });
    // console.log ("THIS IS THE NEW ACTIVITY: ", activity )
    res.send(
      activity
    )}
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

module.exports = router;
