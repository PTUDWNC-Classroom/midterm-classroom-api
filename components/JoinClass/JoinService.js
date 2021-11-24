const classModel = require("../classes/classesModel")


exports.addStudent = async ({userInfo}) => {
    //console.log("userINFO")
    //console.log(userInfo)
    const user = {
        classId: userInfo.classId,
        userId: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
      }
    const newStudent = new classModel.StudentsOfClass(user)

    await newStudent.save()
  
    //console.log("add student");

    return newStudent;
}

exports.addTeacher= async ({userInfo}) => {
    //console.log("userINFO")
    //console.log(userInfo)
    const user = {
        classId: userInfo.classId,
        userId: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
      }
    const newTeacher = new classModel.TeachersOfClass(user)

    await newTeacher.save()
  
    //console.log("add teacher");

    return newTeacher;
}