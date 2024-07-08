const express = require("express");
const router = express.Router();
const  checkToken = require("../middleware/authToken") 

const userController = require("../controllers/userController");

router.post("/register", checkToken, userController.createUser);

router.post("/login", userController.userLogin);

router.get("/users", checkToken, userController.getUsers);

module.exports = router;