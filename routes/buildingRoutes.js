const express = require("express");
const router = express.Router();

const fileUpload = require("../config/file-upload");

const buildingController = require("../controllers/buildingController");

const multer = require('multer');

const  checkToken = require("../middleware/authToken") 

router.post("/",fileUpload.array("gallery"),checkToken, buildingController.createBuilding);
router.get("/", buildingController.getAllBuilding);
router.get("/:id", buildingController.getBuildingById);
router.patch("/:id", checkToken,  buildingController.updateBuilding);
router.delete("/:id",checkToken, buildingController.removeBuilding);

module.exports = router;