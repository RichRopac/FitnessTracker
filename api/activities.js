const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const id = req.params.activityId;
    console.log("activityId: ", id);
    const activity = await getActivityById(id);
    console.log("activity: ", activity);
    const publicRoutine = await getPublicRoutinesByActivity({ id });
    console.log("activity id:  ", { id });
    console.log("publicRoutine: ", publicRoutine);

    if (!activity) {
      res.send({
        error: "NoPublicRoutine",
        message: `Activity ${id} not found`,
        name: "Activity not found",
      });
    }
    res.send(publicRoutine);

    console.log("this is request: ", req.params);
  } catch (error) {
    next(error);
  }
});
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
  const { name, description } = req.body;
  // console.log("Req.BODY HERE ", req.body)
  try {
    const _activity = await getActivityByName(name);
    // console.log("THIS IS A NEW ACTIVITY", name)

    if (_activity) {
      res.send({
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
        error: "Error Activity already exists..",
      });
    } else {
      const activity = await createActivity({ name, description });
      // console.log ("THIS IS THE NEW ACTIVITY: ", activity )
      res.send(activity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const _activity = await getActivityByName(name);
    const actID = await getActivityById(activityId);

    // console.log("SENT ACTIVITY ID", activityId);
    // console.log("SENT NAME: ", name);
    // console.log("SENT DESCRIPTION: ", description);

    // console.log("LOOKED UP ACTIVITY BY NAME: ", _activity);
    // console.log("LOOKED UP ACTIVITY BY ACTIVITY_ID ", actID);

    if (_activity) {
      res.send({
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
        error: "Error Activity already exists..",
      });
    }
    // console.log(
    //   "THIS IS WHAT WE ARE UPDATING: name ",
    //   name,
    //   " Description ",
    //   description
    // );

    if (!actID) {
      // console.log("DOES ACTIVITY EXIST: ", _activity);
      res.send({
        name: "ActivityNotFound",
        message: `Activity ${activityId} not found`,
        error: "Error Activity does not exist",
      });
    }
    const updateField = {};
    // console.log("UPDATE Field fresh: ", updateField);
    if (name) {
      updateField.name = name;
    }
    // console.log("UPDATE Field name: ", updateField);

    if (description) {
      updateField.description = description;
    }
    // console.log("activityId!!!!", activityId);
    // console.log("UPDATE Field description: ", updateField);
    const updatedActivity = await updateActivity({
      id: activityId,
      name: name,
      description: description,
    });
    // console.log("THIS IS THE UPDATED ACTIVITY TO SEND BACK: ", updatedActivity);
    res.send(updatedActivity);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
