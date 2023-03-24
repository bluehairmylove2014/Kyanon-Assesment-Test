const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploada = multer({ dest: 'avatar/' });

const {
    getData,
    setData
} = require("../controllers/profile.controller");

router.get("/getData", getData);
router.put("/setData", setData);

module.exports = router;