const express = require("express");
const { ja } = require("faker/lib/locales");
const { routes, response } = require("../app");
const router = express.Router();
const jwt_decode = require("jwt-decode");
const {
  updateRoutineActivity,
  canEditRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  try {
    // auth here

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

    const id = req.params.routineActivityId;
    // console.log(req.params, " Patch params");
    const { count, duration } = req.body;
    // console.log(req.body, " Body");
    const Routine = await getRoutineActivityById(id);
    const RoutineName = await getRoutineById(Routine.routineId);
    // console.log("Rname: ", RoutineName);
    const userCanUpdate = await canEditRoutineActivity(id, creatorId);
    // console.log("THIS IS THE ROUTINE:", routineById);

    if (userCanUpdate) {
      //   console.log("UPDATE Field fresh: ", updateField);

      const updatedRoutineActivity = await updateRoutineActivity({
        id: id,
        duration: duration,
        count: count,
      });
      res.send(updatedRoutineActivity);
    } else {
      res.send({
        error: "UnauthorizedError",
        message: `User ${decoded.username} is not allowed to update ${RoutineName.name}`,
        name: "UnauthorizedError",
      });
    }
  } catch (error) {
    next(error);
  }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async function (req, res, next) {
  try {
    const id = req.params.routineActivityId;

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
    const routineActivityById = await getRoutineActivityById(id);
    const routineById = await getRoutineById(id);
    // console.log("THIS IS THE ROUTINE:", routineById);

    if (creatorId === routineById.creatorId) {
      //   console.log("UPDATE Field fresh: ", updateField);

      await destroyRoutineActivity(id);
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
    const isDeleted = await getRoutineActivityById(id);
    if (!isDeleted) {
      res.send(routineActivityById);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
