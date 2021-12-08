const userService = require("./userService")
const mailer = require("./mailer")
const random = require("random")
const jwt = require("jsonwebtoken")


const userModel = require("./userModel")

let store = require("store")

exports.signUpHandler = async (req, res, next) => {
  //console.log("post ")
  //let userId = null
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
  const userInfo = await userService.getDecodedOAuthJwtGoogle(req.body.idToken)

  const data = {
    email: userInfo.payload.email,
    username: userInfo.payload.name,
    studentId: "",
  }

  const emailExistInData = await userModel.findOne({ email: data.email })

  if (emailExistInData && emailExistInData.password === undefined) {
    res.json({
      user: emailExistInData,
      idToken: jwt.sign(
        {
          _id: emailExistInData._id,
          username: emailExistInData.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7h",
        }
      ),
    })
  } else if (emailExistInData === null) {
    const newUser = await userService.addSocialLoginUser(data)
    res.json({
      user: newUser,
      idToken: jwt.sign(
        {
          _id: newUser._id,
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7h",
        }
      ),
    })
  } else {
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
  res.json({
    user: req.user,
    token: jwt.sign(
      {
        _id: req.user._id,
        username: req.user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7h",
      }
    ),
  })
}

exports.addStudentId = async (req, res, next) => {
  const userInfo = await userService.updateStudentId(
    req.body.userId,
    req.body.studentId
  )
  res.json(userInfo)
}

exports.getUserInfo = async (req, res, next) => {
  const userInfo = await userService.getUser(req.params.id)
  if (userInfo) {
    if (userInfo.password) delete userInfo.password
    res.json(userInfo)
  } else res.sendStatus(404)
}
