const bcrypt = require("bcrypt")
//const emailValidator = require('email-deep-validator');

const userModel = require("./userModel")
const mongoose = require("mongoose")
const saltRounds = 10

exports.hashPassword = async (password) => {
  const password_hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return password_hash
}

exports.checkUserSignUp = async (account) => {
  let check = {
    isFailEmail: false,
    valid: false,
  }
  // Kiểm tra email cố tồn tại trong cơ sở dữ liệu không
  const emailExist = await userModel.findOne({ email: account.email })
  //const EmailValidator = new emailValidator();
  //let emailValid = await EmailValidator.verify(account.email);
  // console.log("EMAIL VALID");
  // //console.log(emailValid.validators.smtp.reason);
  // console.log(emailValid);

  // while(emailValid.validMailbox == null)
  // {
  //     emailValid = await EmailValidator.verify(account.email);
  // }

  // check.valid = emailValid.validMailbox;

  // console.log("KIEM TRA EMAIL TỒN TẠI KHÔNG");

  // console.log(emailExist);

  // console.log(check);
  // //console.log(valid);

  if (emailExist !== null) {
    return false
  }

  return true
}

exports.createNewUser = async (data) => {
  const userInfo = {
    username: data.username,
    password: data.password,
    email: data.email,
  }

  const newUser = new userModel(userInfo)

  await newUser.save()

  return newUser._id
}

exports.AddSocialLoginUser = async (data) => {
  //console.log("addsocial")
  //console.log(data)
  const userInfo = {
    username: data.username,
    email: data.email,
  }

  const newUser = new userModel(userInfo)

  await newUser.save()

  //console.log("add")
  return newUser._id
}

// passport needs to use these functions

exports.checkUser = async (username, password) => {
  const user = await userModel.findOne({ username: username })

  //console.log("check user")
  //console.log(user)
  if (!user) {
    return false
  }
  let checkPassword = await bcrypt.compare(password, user.password)
  if (checkPassword) {
    return user
  }

  return false
}

exports.getUser = async (id) => {
  return await userModel.findOne({ _id: id })
}

exports.updateStudentId = async (userId, studentId) => {
  return await userModel.findOneAndUpdate(
    { _id: userId },
    { studentId: studentId }
  )
}
