const express = require("express")
const router = express.Router()

const joinController = require("./JoinController");

router.post("/add-student", joinController.addStudentHandler)

router.post("/add-teacher", joinController.addTeacherHandler)

router.post("/invite", joinController.sendInviteHandler)

module.exports = router