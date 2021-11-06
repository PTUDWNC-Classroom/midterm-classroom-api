module.exports = function (sequelize, Sequelize) {
  const classes = sequelize.define('classes', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    className: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    section: {
      type: Sequelize.STRING,
      defaultValue: '',
    },

    subject: {
      type: Sequelize.STRING,
      defaultValue: '',
    },

    room: {
      type: Sequelize.STRING,
      defaultValue: '',
    },

    studentTotal: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    createdDate: {
      type: Sequelize.DATE
    }
  });

  return classes;
}