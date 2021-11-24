const express = require("express")
const router = express.Router()

const classesController = require("./classesController")

router.get("/teachers-of-class/:id", classesController.getListOfTeachers)

router.get("/students-of-class/:id", classesController.getListOfStudents)

router.get("/:id", classesController.getClass)

/* GET classes listing. */
router.post("/class-list", classesController.getClassList)

router.post("/", classesController.createClass)



module.exports = router
