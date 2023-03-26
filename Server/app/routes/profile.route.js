const express = require("express");
const router = express.Router();

const {
    getData,
    setData
} = require("../controllers/profile.controller");

router.get("/getData", getData);
router.put("/setData", setData);

module.exports = router;