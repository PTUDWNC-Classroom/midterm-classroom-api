const passport = require('./passport');
const userService = require('./userService');

exports.signUpHandler = async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  data.password = await userService.hashPassword(data.password);
  const userId  = await userService.createNewUser(data);

  res.json(userId);
}

exports.signInHandler = async (req, res, next) => {
    // console.log(req.body);
    // const data = req.body;
   
    // console.log(data.username)
    // //const userId = await userService.checkUser(data.username,data.password);
    // await userService.passportSignIn();

    // console.log("sign-in passport");

    // res.json(userId);
    
  }