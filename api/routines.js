const express = require("express");
const router = express.Router();
const jwt_decode = require("jwt-decode");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
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
    console.log("DECODED: ", decoded);

    const creatorId = decoded.id;
    console.log("CREATOR ID: ", creatorId);

    const { isPublic, name, goal } = req.body;
    console.log("REQ BODY: ", req.body);

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
    console.log("THIS IS THE ORIGN NAME: ", goal);
    const { routineId } = req.params;
    const originname = name;

    console.log("PATCH PARAMETERS: ", req.params);

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
    console.log("ID!!! ", creatorId);

    const routineById = await getRoutineById(routineId);
    console.log("THIS IS THE ROUTINE:", routineById);

    if (creatorId === routineById.creatorId) {
      const updateField = {};
      console.log("UPDATE Field fresh: ", updateField);

      // if (isPublic) {
      //   updateField.isPublic = isPublic;
      // }
      // console.log("UPDATE Field isPublic: ", updateField);

      // if (name) {
      //   updateField.name = name;
      // }
      // console.log("UPDATE Field name: ", updateField);

      // if (goal) {
      //   updateField.goal = goal;
      // }
      const updatedRoutine = await updateRoutine({
        id: routineId,
        creatorId: creatorId,
        isPublic: isPublic,
        name: name,
        goal: goal,
      });
      console.log("UPDATE Field goal: ", updateField);

      console.log("creatorId!!!!", creatorId);
      console.log("UPDATE Field Final: ", updateField);

      console.log("PATCH BODY: ", req.body);
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

// POST /api/routines/:routineId/activities

module.exports = router;
