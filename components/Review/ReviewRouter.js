const express = require("express")
const router = express.Router()

const ReviewController = require("./ReviewController")

router.post("/sendMessage", ReviewController.sendMessage)

module.exports = router