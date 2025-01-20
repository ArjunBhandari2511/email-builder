const express = require("express");
const router = express.Router();
const {getEmailLayout , uploadImage , uploadEmailConfig , renderAndDownloadTemplate} = require("../controllers/emailController");

// Route Definitions
router.get("/getEmailLayout" , getEmailLayout);
router.post("/uploadImage" , uploadImage);
router.post("/uploadEmailConfig" , uploadEmailConfig);
router.post("/renderAndDownloadTemplate" , renderAndDownloadTemplate);

module.exports = router;