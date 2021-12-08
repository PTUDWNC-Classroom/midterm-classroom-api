const express = require("express")
const gradeAssignmentController = require("../Controller/gradeAssignmentController")

const router = express.Router()


router.post("/getGradeAssignment", gradeAssignmentController.getGradeStruct)

router.post("/addAssignment", gradeAssignmentController.addAssignment)

router.post("/updateAssignment", gradeAssignmentController.updateAssignment)

router.post("/updateIndexAssignment", gradeAssignmentController.updateIndexAssignment)

router.post("/deleteAssignment", gradeAssignmentController.deleteAssignment)


module.exports = router