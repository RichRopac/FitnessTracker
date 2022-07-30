function requireUser(req, res, next) {
    // console.log("REQ USERS ",req.user)
    if (!req.user) {
      res.status(401);
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser,
  };
  