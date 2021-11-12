const classesModel = require('./classesModel');
const mongoose = require('mongoose');

exports.getClassList = async () => {
  return await classesModel.find({}).sort([['createdDate', -1]]);
}

exports.getClassInfo = async (classId) => {
  return await classesModel.findById(classId);
}

exports.createNewClass = async (data) => {
  const classInfo = {
    //creator: mongoose.Types.ObjectId(data.),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: "invite-code",
  }
  const newClass = new classesModel(classInfo);

  await newClass.save();

  return newClass._id;
}

exports.classModify = async ({query,updateData}) => 
{
  console.log(updateData.inviteCode);
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

  const a = await classesModel.updateOne(query,{
      className: updateData.className,
      section: updateData.section,
      subject: updateData.subject,
      room: updateData.room,
      inviteCode: updateData.inviteCode
  });

  console.log(a);
}