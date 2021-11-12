const classesService = require('./classesService');

exports.getClassList = async (req, res, next) => {
  const result = await classesService.getClassList();
  res.json(result);
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id);
  res.json(result);
}

exports.createClass = async (req, res, next) => {
  const data = req.body;
  const newClassId = await classesService.createNewClass(data);
  const updateData ={
    //creator: mongoose.Types.ObjectId(data.),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: newClassId.toString(),
  }
  console.log("modify");
  await classesService.classModify({newClassId,updateData});

  res.json(newClassId);
}