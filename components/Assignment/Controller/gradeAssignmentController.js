const gradeAssignmentService = require("../Service/gradeAssignmentService")

exports.getGradeStruct = async (req, res, next) => {
  console.log("getGradeStruct")

  // Nhận classId
  //console.log(req.body)
  const classId = req.body.classId

  // Tìm gradeAssignment của classId
  const result = await gradeAssignmentService.getGradeStructAssignment(classId)
  //console.log(result)

  res.json(result)
}

exports.addAssignment = async (req, res, next) => {
  console.log("addAssignment")

  // Dữ liệu truyền vào
  console.log(req.body)
  const assignment = req.body

  // Thêm gradeTitle và gradeDetail vào database
  const result = await gradeAssignmentService.addAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.updateAssignment = async (req, res, next) => {
  console.log("addAssignment")

  // Dữ liệu truyền vào
  console.log(req.body)
  const assignment = req.body

  // Thêm gradeTitle và gradeDetail vào database
  const result = await gradeAssignmentService.updateAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.updateIndexAssignment = async (req, res, next) => {
  console.log("updateIndexAssignment")

  // Dữ liệu truyền vào
  console.log(req.body)
  const assignment = req.body

  // update indexAssignment khi drag và drop
  const result = await gradeAssignmentService.updateIndexAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.deleteAssignment = async (req, res, next) => {
  console.log("deleteAssignment")

  // Dữ liệu truyền vào
  console.log(req.body)
  const assignment = req.body

  // Xóa assignment trong database theo _id
  const result = await gradeAssignmentService.deleteAssignmentStruct(assignment)

  res.json(result)
}

exports.uploadAssignment = async (req, res, next) => {
  console.log("upload Assignment")

  // Dữ liệu truyền vào
  /**
   * data: Array
   * assignmentId: String
   */
  console.log("Data", req.body)
  const data = req.body.data
  const assignmentId = req.body.assignmentId

  // Xóa assignment trong database theo _id
  const result = await gradeAssignmentService.uploadAssignmentCSV(
    data,
    assignmentId
  )

  res.json(result)
}

exports.uploadStudentList = async (req, res, next) => {
  console.log("upload studentlist")

  // Dữ liệu truyền vào
  /**
   * data: Array
   * classId: String
   */
  console.log("Data", req.body)
  const data = req.body.data
  const classId = req.body.classId
  console.log(typeof classId)

  let studentIdList = []
  let fullnameList = []
  // Remove title
  data.shift()
  // Mapping data
  data.forEach((element) => {
    studentIdList.push(element[0])
    fullnameList.push(element[1])
  })

  // Upload student list
  const result = await gradeAssignmentService.uploadStudentListCSV(
    studentIdList,
    fullnameList,
    classId
  )

  // Create gradeList template if gradeAssignment exist
  gradeAssignmentService.addGradeListTemplate(classId, studentIdList)

  res.json(result)
}

exports.getRealStudentList = async (req, res, next) => {
  const classId = req.params.id

  if (gradeAssignmentService.isValidObjectId(classId)) {
    const realStudentList = await gradeAssignmentService.getRealStudentList(
      classId
    )

    if (realStudentList) {
      res.json([realStudentList.studentIdList, realStudentList.fullnameList])
    } else res.json([])
  } else {
    res.status(404)
    res.send("Class not found to get real student list!")
  }
}
