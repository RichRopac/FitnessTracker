const express = require("express");
const router = express.Router();
const jwt_decode = require("jwt-decode");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  attachActivitiesToRoutines,
} = require("../db");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const pubRoutine = await getAllPublicRoutines();
    // console.log("All public routines: ", pubRoutine);
    res.send(pubRoutine);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/", async (req, res, next) => {
  try {
    const auth = req.header("Authorization");
    // console.log("AUTHORIZATION: ", auth);
    if (!auth) {
      res.send({
        error: "UnauthorizedError",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }

    const decoded = jwt_decode(auth);
    // console.log("DECODED: ", decoded);

    const creatorId = decoded.id;
    // console.log("CREATOR ID: ", creatorId);

    const { isPublic, name, goal } = req.body;
    // console.log("REQ BODY: ", req.body);

    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId", async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;

    const { routineId } = req.params;

    // console.log("PATCH PARAMETERS: ", req.params);

    const auth = req.header("Authorization");
    if (!auth) {
      res.send({
        error: "UnauthorizedError",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }
    const decoded = jwt_decode(auth);
    const creatorId = decoded.id;
    // console.log("ID!!! ", creatorId);

    const routineById = await getRoutineById(routineId);
    // console.log("THIS IS THE ROUTINE:", routineById);

    if (creatorId === routineById.creatorId) {
      //   console.log("UPDATE Field fresh: ", updateField);

      const updatedRoutine = await updateRoutine({
        id: routineId,
        creatorId: creatorId,
        isPublic: isPublic,
        name: name,
        goal: goal,
      });
      //   console.log("UPDATE Field goal: ", updateField);

      //   console.log("creatorId!!!!", creatorId);
      //   console.log("UPDATE Field Final: ", updateField);

      //   console.log("PATCH BODY: ", req.body);
      res.send(updatedRoutine);
    } else {
      res.status(403).send({
        error: "UnauthorizedError",
        message: `User ${decoded.username} is not allowed to update ${routineById.name}`,
        name: "UnauthorizedError",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", async (req, res, next) => {
  try {
    const id = req.params.routineId;

    // console.log("PATCH PARAMETERS: ", req.params);

    const auth = req.header("Authorization");
    if (!auth) {
      res.send({
        error: "UnauthorizedError",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }
    const decoded = jwt_decode(auth);
    const creatorId = decoded.id;
    // console.log("ID!!! ", creatorId);

    const routineById = await getRoutineById(id);
    // console.log("THIS IS THE ROUTINE:", routineById);

    if (creatorId === routineById.creatorId) {
      //   console.log("UPDATE Field fresh: ", updateField);

      await destroyRoutine(id);
      //   console.log("UPDATE Field goal: ", updateField);

      //   console.log("creatorId!!!!", creatorId);
      //   console.log("UPDATE Field Final: ", updateField);
    } else {
      res.status(403).send({
        error: "UnauthorizedError",
        message: `User ${decoded.username} is not allowed to delete ${routineById.name}`,
        name: "UnauthorizedError",
      });
    }
    const isDeleted = await getRoutineById(id);
    if (!isDeleted) {
      res.send(routineById);
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { routineId, activityId, count, duration } = req.body;
    console.log("post body: ", req.body);
    console.log("post params: ", req.params);
    const attachedActivity = await attachActivitiesToRoutines(routineId);
    res.send(attachedActivity);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
