const classesModel = require("./classesModel")
const mongoose = require("mongoose")

exports.getClassList = async (_id) => {
  //console.log("dang get class list")
  let classes = [];

  const classStudent = await classesModel.StudentsOfClass.find({ userId: _id });
  for(let i = 0; i<classStudent.length;i++)
  {
    //console.log(classStudent[i].classId);
    const a = await classesModel.Classes.find({_id: classStudent[i].classId})
    //console.log(a);
    if(a !== null)
    {
      classes.push(a[0]);
    }
  }

  const classTeacher = await classesModel.TeachersOfClass.find({ userId: _id });
  for(let i = 0; i<classTeacher.length;i++)
  {
    //console.log(classTeacher[i].classId);
    const a = await classesModel.Classes.find({_id: classTeacher[i].classId})
    //console.log(a);
    if(a !== null)
    {
      classes.push(a[0]);
    }
  }
  
  //console.log(classes)
  //console.log(classStudent)
  return classes;
}

exports.getClassInfo = async (classId) => {
  return await classesModel.Classes.findById(classId)
}

exports.createNewClass = async (data) => {
  const classInfo = {
    creator: mongoose.Types.ObjectId(data._id),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: "invite-code",
  }
  const newClass = new classesModel.Classes(classInfo)

  await newClass.save()

  return newClass._id
}

exports.classModify = async ({ updateData }) => {
  //console.log("update")
  //console.log(updateData.inviteCode)
  // const a = await classesModel.findByIdAndUpdate(
  //   query,
  //   {
  //     className: updateData.className,
  //     section: updateData.section,
  //     subject: updateData.subject,
  //     room: updateData.room,
  //     inviteCode: updateData.inviteCode,
  //   }
  // )
  const a = await classesModel.Classes.findOneAndUpdate(
    { _id: updateData.inviteCode, className: updateData.className },
    {
      creator: updateData.creator,
      className: updateData.className,
      section: updateData.section,
      subject: updateData.subject,
      room: updateData.room,
      inviteCode: updateData.inviteCode,
    }
  )

  //console.log(a)
}

exports.getListOfTeachers = async (classId) => {
  return await classesModel.TeachersOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}

exports.getListOfStudents = async (classId) => {
  return await classesModel.StudentsOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}

exports.addTeacherToClass = async (classId, userId, username, email) => {
  const teacherInfo = {
    classId: classId,
    userId: userId,
    username: username,
    email: email,
  }

  const newTeacher = classesModel.TeachersOfClass(teacherInfo)
  await newTeacher.save()
  //console.log("save new teacher")
}
