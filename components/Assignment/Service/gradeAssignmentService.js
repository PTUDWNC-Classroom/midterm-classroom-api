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

  // Get length of studentList to create gradeList template (to render grade board)
  let gradeList = []

  const classInfo = await gradeAssignmentModel.UploadedStudentList.findOne({ classId: assignment.classId })

  if (classInfo) {
    classInfo.studentIdList.forEach((item) => {
      gradeList.push({
        studentId: item,
        grade: ""
      })
    })
  }

  // Thêm vào database
  const assignmentInfo = {
    classId: assignment.classId,
    gradeTitle: assignment.gradeTitle,
    gradeDetail: assignment.gradeDetail,
    disableState: true,
    indexAssignment: index,
    gradeList: gradeList,
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

exports.uploadAssignmentCSV = async (data, assignmentId,classId) => {
  console.log(assignmentId)
  //console.log(classId);
  

  // Remove titles
  data.shift()

  
  // Lấy dữ liệu từ data thành 2 mảng
  let StudentIdList = []
  let gradeList = []
  data.forEach((element) => {
    StudentIdList.push(element[0])
    gradeList.push(element[1])
  })

  // Chưa biết xử lý nếu như StudentList không có upload trước
  // Lấy dữ liệu từ UploadedStudentList
  const StudentList = await gradeAssignmentModel.UploadedStudentList.findOne({classId: classId});

  console.log(StudentList);
  // Map realStudentList bằng studentIdList từ StudentList vừa lấy
  let realStudentList =  StudentList.studentIdList;

  // Không biết xử lý như thế nào nếu như StudentId vừa truyền vào không có trong StudentIdList

  // Tạo một mảng [0,0...] với độ dài của realStudentList
  //let grade = Array(realStudentList.length).fill(null).map((u, i) => 0);

  
  //console.log(realStudentList);
  // Map grade dựa vào realStudentList vào StudentIdList
  let grade = realStudentList.map(val => {
      if(StudentIdList.includes(val))
      {
        return gradeList[StudentIdList.indexOf(val)];
      }
      else{
        return 0;
      }
  }
    )

  console.log(grade);
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

// Sắp xếp tăng dần
function SortUpAscending(studentIdList, fullnameList) {
  let tmp = null;
  let name = null;
  for (let i = 0; i < studentIdList.length - 1; i++) {
    for (let j = i + 1; j < studentIdList.length; j++) {
      if (studentIdList[i] > studentIdList[j]) {
        tmp = studentIdList[i]
        studentIdList[i] = studentIdList[j]
        studentIdList[j] = tmp

        name = fullnameList[i]
        fullnameList[i] = fullnameList[j]
        fullnameList[j] = name
      }
    }
  }
  //console.log(studentIdList)
  //console.log(fullnameList);
}

exports.uploadStudentListCSV = async (studentIdList, fullnameList, classId) => {
  console.log(classId)

  // Check exist
  let response
  const a = await gradeAssignmentModel.UploadedStudentList.findOne({
    classId: classId,
  })
  console.log(a)
  // Sắp xếp theo studentId tăng dần
  SortUpAscending(studentIdList, fullnameList);
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

    // Lấy dữ liệu từ database
    /**
     * Ta nhận được:
     * a.studentIdList
     * a.fullnameList
     */

    // So sánh dữ liệu cũ với dữ liệu mới
    /**
     * VD: cũ có:
     * studentIdList: 1 3 4 
     * fullnameList:  a c d 
     * 
     * mới có:
     * studentIdList: 1 2 6 
     * fullnameList:  a c e
     * 
     * 
     */

    var studentIdListData = a.studentIdList;
    var fullnameListData = a.fullnameList;

    //console.log(studentIdListData);

    // So sánh studentId cũ và mới và trả về mảng studentIdList không trùng
    var newstudentIdList = studentIdList.filter(val => !studentIdListData.includes(val));

    // Thêm newstudentIdList vào studentIdList ban đầu
    // Thêm fullnameList mới tương ứng với newstudentIdList
    newstudentIdList.map(val => {
      studentIdListData.push(val);
      fullnameListData.push(fullnameList[studentIdList.indexOf(val)]);
    })

    // Sắp xếp theo studentId tăng dần
    SortUpAscending(studentIdListData, fullnameListData);


    response = await gradeAssignmentModel.UploadedStudentList.findOneAndUpdate(
      { classId: classId },
      {
        studentIdList: studentIdListData,
        fullnameList: fullnameListData,
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

exports.updateGrade = async (assignmentId, studentId, grade) => {
  const res = await gradeAssignmentModel.GradeAssignment.updateOne(
    {
      _id: assignmentId,
      "gradeList.studentId": studentId,
    },
    {
      $set: {
        "gradeList.$.grade": grade,
      },
    }
  )

  //console.log(res)
  return res.modifiedCount
}

exports.calcTotalGradeColumn = async (gradeStructAssignemnt, classId) => {
  let totalGrade = 0;
  let totalGradeColumn = []
  if (gradeStructAssignemnt?.length > 0) {
    gradeStructAssignemnt.forEach((item) => {
      totalGrade += parseFloat(item.gradeDetail)
    })

    totalGradeColumn = Array(gradeStructAssignemnt[0].gradeList.length).fill(0)

    gradeStructAssignemnt.forEach((item) => {
      const prescent = parseFloat(item.gradeDetail) / totalGrade
      item.gradeList.forEach((student, index) => {
        totalGradeColumn[index] += parseFloat((student.grade * prescent).toFixed(2))
      })
    })
  }

  return totalGradeColumn
}


exports.createManageBoardData = async (classId,assignmentIdList) => {
  console.log(classId);
  console.log(assignmentIdList);

  return 0;
}