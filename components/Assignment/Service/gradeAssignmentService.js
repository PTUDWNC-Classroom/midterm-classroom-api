const mongoose = require("mongoose")
const gradeAssignmentModel = require("../Model/gradeAssignment")

// Sắp xếp theo indexAssignment
function SortByIndexAssignment(data) {
  let result = data
  let tmp = null
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (result[i].indexAssignment > result[j].indexAssignment) {
        tmp = result[i]
        result[i] = result[j]
        result[j] = tmp
      }
    }
  }
  //console.log(result);
  return result
}

exports.getGradeStructAssignment = async (classId) => {
  // Tìm tất cả GradeAssignment theo classId
  const result = await gradeAssignmentModel.GradeAssignment.find({
    classId: mongoose.Types.ObjectId(classId),
  })

  //console.log(result)

  const result_sort = SortByIndexAssignment(result)

  return result_sort
}

exports.addAssignmentIntoStruct = async (assignment) => {
  //console.log(assignment);

  // Đếm số lượng assignment
  const data = await gradeAssignmentModel.GradeAssignment.find()

  // Thêm indexAssignment để sắp xếp khi drag và drop
  const data_sort = SortByIndexAssignment(data)
  let index = data_sort.length
  if (index !== 0) {
    //console.log(data[index-1])
    //console.log(typeof( data[index - 1].indexAssignment))
    index = data_sort[index - 1].indexAssignment + 1
  }
  // Thêm vào database
  const assignmentInfo = {
    classId: assignment.classId,
    gradeTitle: assignment.gradeTitle,
    gradeDetail: assignment.gradeDetail,
    disableState: true,
    indexAssignment: index,
  }
  const newGradeAssignment = new gradeAssignmentModel.GradeAssignment(
    assignmentInfo
  )

  await newGradeAssignment.save()

  return newGradeAssignment._id
}

exports.updateAssignmentIntoStruct = async (assignment) => {
  console.log(assignment)
  const result = await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
    { _id: assignment._id },
    {
      gradeTitle: assignment.gradeTitle,
      gradeDetail: assignment.gradeDetail,
    }
  )

  return result
}

exports.updateIndexAssignmentIntoStruct = async (assignment) => {
  console.log("updateIndexAssignmentIntoStruct")

  // Tìm tất cả assignment theo classId
  const assignment1 = await gradeAssignmentModel.GradeAssignment.find({
    classId: mongoose.Types.ObjectId(assignment.classId),
  })

  // Sắp xếp assignment vừa tìm được
  const result_sort = SortByIndexAssignment(assignment1)

  //console.log((result_sort[1]._id).toString() === assignment.sourceId)
  // Thay desIndex vào indexAssignment của gradeAssignment có sourceId
  await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
    { _id: assignment.sourceId },
    {
      indexAssignment: assignment.desIndex,
    }
  )
  if (assignment.sourceIndex < assignment.desIndex) {
    for (let i = 0; i < result_sort.length; i++) {
      if (result_sort[i]._id.toString() === assignment.sourceId) {
        //console.log("vao ")
        for (let j = i + 1; j < result_sort.length; j++) {
          await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
            { _id: result_sort[j]._id },
            {
              indexAssignment: result_sort[j - 1].indexAssignment,
            }
          )
          if (result_sort[j]._id.toString() === assignment.desId) {
            break
          }
        }
        break
      }
    }
  } else if (assignment.sourceIndex > assignment.desIndex) {
    for (let i = 0; i < result_sort.length; i++) {
      if (result_sort[i]._id.toString() === assignment.desId) {
        //console.log("vao ")
        for (let j = i; j < result_sort.length - 1; j++) {
          await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
            { _id: result_sort[j]._id },
            {
              indexAssignment: result_sort[j + 1].indexAssignment,
            }
          )
          if (result_sort[j + 1]._id.toString() === assignment.sourceId) {
            break
          }
        }
        break
      }
    }
  }

  // const assignment1 = await gradeAssignmentModel.findOneAndUpdate(
  //     { _id: assignment.desId },
  //     {
  //         indexAssignment: assignment.sourceIndex
  //     })

  // const assignment2 = await gradeAssignmentModel.findOneAndUpdate(
  //     { _id: assignment.sourceId },
  //     {
  //         indexAssignment: assignment.desIndex
  //     })

  // let result = false;

  // if(assignment1!== null && assignment2 !== null)
  // {
  //     result =false;
  // }

  return true
}

exports.deleteAssignmentStruct = async (assignment) => {
  console.log(assignment)
  const result = await gradeAssignmentModel.GradeAssignment.deleteOne({
    _id: assignment._id,
  })

  return result
}

/**
 * Create object array
 * @param {Array} studentIdArr array of student id
 * @param {Array} gradeArr  array of grade
 * @returns
 */
const convertArrToObjArr = (studentIdArr, gradeArr) => {
  let studentObjArr = []
  studentIdArr.forEach((element, index) => {
    studentObjArr.push({
      studentId: element,
      grade: gradeArr[index],
    })
  })

  return studentObjArr
}

exports.uploadAssignmentCSV = async (data, assignmentId) => {
  console.log(assignmentId)

  let realStudentList = []
  let grade = []

  // Remove titles
  data.shift()

  // Mapping data
  data.forEach((element) => {
    realStudentList.push(element[0])
    grade.push(element[1])
  })

  gradeList = convertArrToObjArr(realStudentList, grade)

  // Update
  const response = await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
    { _id: assignmentId },
    {
      gradeList: gradeList,
    }
  )

  return response ? true : false
}

exports.uploadStudentListCSV = async (studentIdList, fullnameList, classId) => {
  console.log(classId)

  // Check exist
  let response
  const a = await gradeAssignmentModel.UploadedStudentList.findOne({
    classId: classId,
  })
  console.log(a)
  if (!a) {
    response = new gradeAssignmentModel.UploadedStudentList({
      classId: classId,
      studentIdList: studentIdList,
      fullnameList: fullnameList,
    })
    console.log("create", response)
    await response.save()
  } else {
    console.log("update")
    response = await gradeAssignmentModel.UploadedStudentList.findOneAndUpdate(
      { classId: classId },
      {
        studentIdList: studentIdList,
        fullnameList: fullnameList,
      }
    )
  }

  return response ? true : false
}

/**
 * Check valid classId
 * @param {String} id classId
 * @returns
 */
exports.isValidObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    if (String(mongoose.Types.ObjectId(id)) === id) return true
    return false
  }
  return false
}

exports.getRealStudentList = async (classId) => {
  const result = await gradeAssignmentModel.UploadedStudentList.findOne({
    classId: classId,
  })

  return result
}

const updateGradeList = async (gradeAssignment, tmpArr) => {
  gradeAssignment.map(async (item) => {
    await gradeAssignmentModel.GradeAssignment.findOneAndUpdate(
      { _id: item._id },
      {
        gradeList: tmpArr,
      }
    )
  })
}

exports.addGradeListTemplate = async (classId, studentIdList) => {
  const gradeAssignment = await this.getGradeStructAssignment(classId)

  if (gradeAssignment.length > 0) {
    const tmpArr = convertArrToObjArr(
      studentIdList,
      Array(studentIdList.length).fill("")
    )

    await updateGradeList(gradeAssignment, tmpArr)
  }
}
