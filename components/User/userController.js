const userService = require("./userService")
const mailer = require("./mailer")
const random = require("random")

const passport = require("./passport")
const userModel = require("./userModel")

let store = require("store")

exports.signUpHandler = async (req, res, next) => {
  //console.log("post ")
  let userId = null
  //console.log(req.body)
  const data = req.body
  const checkEmailValid = await userService.checkUserSignUp(data)
  //console.log("checkEmailValid")
  //console.log(checkEmailValid)
  if (checkEmailValid) {
    const randomOTP = random.int((min = 100000), (max = 999999))
    //console.log(typeof data.email)

    //console.log(randomOTP)
    store.set(data.email, randomOTP)
    //console.log(store.get(data.email))
    mailer.sendmail(data.email, randomOTP)
  }
  res.json(checkEmailValid)
}

exports.loginSocialHandler = async (req, res, next) => {
  //console.log(req.body)
  const data = req.body
  const emailExistInData = await userModel.findOne({ email: data.email })
  //console.log(emailExistInData)
  if (emailExistInData && emailExistInData.password === undefined) {
    //console.log("hello social")
    res.json(emailExistInData._id)
  } else if (emailExistInData === null) {
    //console.log("emailExistInData === null")
    const _id = await userService.AddSocialLoginUser(data)
    res.json(_id)
  } else {
    //console.log("false")
    res.json(false)
  }
}

exports.validEmailHandler = async (req, res, next) => {
  const data = req.body
  //console.log(data)
  //console.log(store.get(data.email))
  if (
    store.get(data.email) != undefined &&
    store.get(data.email) === parseInt(data.OTP)
  ) {
    data.password = await userService.hashPassword(data.password)
    await userService.createNewUser(data)
    return res.json(true)
  }

  return res.json(false)
}

exports.signInHandler = async (req, res, next) => {
  // passport.authenticate('local',function(err, user, info) {
  //   console.log(err);
  //   console.log(user);
  //   console.log(info);
  // }
  // )
  //console.log("hello")
  //console.log(req.user)
  res.json(req.user)
}

exports.addStudentId = async (req, res, next) => {
  const userInfo = await userService.updateStudentId(
    req.body.userId,
    req.body.studentId
  )
  res.json(userInfo)
}
