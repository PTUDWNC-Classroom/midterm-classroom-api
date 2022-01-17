const bcrypt = require("bcrypt")

const AdminModel = require("./adminModel");
const refreshTokenModel = require("../User/refreshTokenModel")
const userService = require("../User/userService")
const classesModel = require("../classes/classesModel")
const userModel = require("../User/userModel")

exports.getAccount = async (email) => {
  return await AdminModel.AdminAccount.findOne({ email: email });
};

exports.getRole = async (id) => {
  return await AdminModel.AdminRole.findOne({accountId: id});
};

exports.getRefreshToken = async (adminInfo) => {
  const result = await refreshTokenModel.findOne({ userId: adminInfo._id});

  if (result) {
    return result.refreshToken;
  } else {
    const refreshToken = await userService.createRefreshToken(adminInfo);
		return refreshToken;
  }
};

exports.checkAdmin = async (email, password) => {
  const admin = await AdminModel.AdminAccount.findOne({ email: email })

  if (!admin) {
    return false
  }
  let checkPassword = await bcrypt.compare(password, admin.password)
  if (checkPassword) {
    return admin
  }

  return false
}

exports.getClassTotal = async () => {
  return await classesModel.Classes.find().count();
}

exports.getUserTotal = async () => {
  return await userModel.find().count();
}

exports.getAdminList = async () => {
  return await AdminModel.AdminAccount.find({});
}