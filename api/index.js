const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// GET /api/health
router.get("/health", async (req, res) => {
  const data = {
    message: "I am healthy",
  };
  res.status(200).send(data);
});

router.get("/unknown", async (req, res) => {
  res.status(404).send({
    message: "Not Found",
  });
});

// set `req.user` if possible
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);

      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
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
const { requireUser } = require("./utilities");
router.use("/routine_activities", routineActivitiesRouter);

module.exports = router;
