// user Routes
const express = require("express");
const router = express.Router();
require("dotenv").config({ path: "../../../.env" });

const userController = require("../Controllers/user.controller");
const auth = require("../helpers/auth");

//Default Route
router.get("/", (req, res) => {
  res.json({
    name: process.env.API_NAME,
    author: process.env.API_TEAM,
    version: process.env.API_VERSION,
  });
});

//get all users
router.get("/users", userController.getUsers);
//create User
router.post("/auth/signup", userController.createUser);
//delete user by Id
router.delete(
  "/user/:id",
  auth.authenticateToken,
  auth.checkUser,
  userController.deleteUser
);
//update User by Id
router.put("/user/:id", auth.authenticateToken, userController.updateUser);
// view user
router.get("/user/:id", auth.authenticateToken, userController.findUserById);
//login
router.post("/auth/login", userController.Login);

router.post("/verify", userController.verifyToken);

router.get("/config/paypal",(req,res)=>{
  res.send("Abzsiativ4qv0_6gkE8APUqvclhTs6NrOKzsVRGKG5TPE5g-yWwWm7vXl2SyEr4uEFpiFqkt0zuVliRv");
})

module.exports = router;
