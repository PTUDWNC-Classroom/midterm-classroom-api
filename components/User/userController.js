const userService = require('./userService');

exports.signUpHandler = async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  data.password = await userService.hashPassword(data.password);
  const userId  = await userService.createNewUser(data);

  res.json(userId);
}

exports.signInHandler = async (req, res, next) => {
   console.log("hello")
   console.log(req.user);

   req.logout();

   console.log("logout");
   console.log(req.user);
    
  }