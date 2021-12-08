const gradeAssignmentService = require("../Service/gradeAssignmentService")

exports.getGradeStruct = async (req, res, next) => {
  console.log("getGradeStruct")

  // Nhận classId 
  //console.log(req.body)
  const classId = req.body.classId

  // Tìm gradeAssignment của classId
  const result = await gradeAssignmentService.getGradeStructAssignment(classId);
  //console.log(result)

  res.json(result)
}

exports.addAssignment = async (req, res, next) => {
  console.log("addAssignment");

  // Dữ liệu truyền vào
  console.log(req.body);
  const assignment = req.body;

  // Thêm gradeTitle và gradeDetail vào database
  const result = await gradeAssignmentService.addAssignmentIntoStruct(assignment);

  res.json(result);
}

exports.updateAssignment = async (req, res, next) => {
  console.log("addAssignment");

  // Dữ liệu truyền vào
  console.log(req.body);
  const assignment = req.body;

  // Thêm gradeTitle và gradeDetail vào database 
  const result = await gradeAssignmentService.updateAssignmentIntoStruct(assignment);

  res.json(result);
}

exports.updateIndexAssignment = async (req, res, next) => {
  console.log("updateIndexAssignment");

  // Dữ liệu truyền vào
  console.log(req.body);
  const assignment = req.body;

  // update indexAssignment khi drag và drop 
  const result = await gradeAssignmentService.updateIndexAssignmentIntoStruct(assignment);

  res.json(result);
}

exports.deleteAssignment = async (req, res, next) => {
  console.log("deleteAssignment");

  // Dữ liệu truyền vào
  console.log(req.body);
  const assignment = req.body;

  // Xóa assignment trong database theo _id 
  const result = await gradeAssignmentService.deleteAssignmentStruct(assignment);

  res.json(result);
}