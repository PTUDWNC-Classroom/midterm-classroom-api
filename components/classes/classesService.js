const db = require('../../database/models/index');
const classes = require('./classes')(db.sequelize, db.Sequelize);

exports.getClassList = async () => {
  return await classes.findAll({
    order: [
      //['id', 'DESC']
      ['createdDate', 'DESC']
    ]
  });
}

exports.getClassInfo = async (classId) => {
  return await classes.findByPk(parseInt(classId));
}

exports.createNewClass = async (data) => {
  const newClass = await classes.create({
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    createdDate: new Date(),
  });

  return newClass.id;
}