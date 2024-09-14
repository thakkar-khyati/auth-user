const express = require("express");

const {
    createUser,
    verifyUser,
    signInUser
  } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.post("/signup",createUser);

userRouter.get("/validate/:id/:token",verifyUser)

userRouter.post("/signin/admin", signInUser)

module.exports = userRouter;