const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

// GET /api/health
router.get("/health", async (req, res) => {
    const data = {
        message: "I am healthy"
    }
    res.status(200).send(data)
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

module.exports = router;
