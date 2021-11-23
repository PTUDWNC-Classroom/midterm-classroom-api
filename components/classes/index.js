const express = require("express")
const router = express.Router()

const classesController = require("./classesController")

router.get("/teachers-of-class/:id", classesController.getListOfTeachers)

router.get("/students-of-class/:id", classesController.getListOfStudents)

router.get("/:id", classesController.getClass)

router.post("/", classesController.createClass)

/* GET classes listing. */
router.post("/class-list", classesController.getClassList)

module.exports = router
