const jwt = require("jsonwebtoken");

const adminSevice = require("./adminService");
const userService = require("../User/userService");
const { AdminAccount } = require("./adminModel");

exports.socialLoginHandler = async (req, res, next) => {
  const adminInfo = await userService.getDecodedOAuthJwtGoogle(
    req.body.idToken
  );

  const data = {
    email: adminInfo.payload.email,
    //username: adminInfo.payload.name,
    //name: adminInfo.payload.name,
  };

  // const emailExistInData = await userModel.findOne({ email: data.email });
  const emailExistInData = await adminSevice.getAccount(data.email);

  if (emailExistInData && emailExistInData.password === undefined) {
    const refreshToken = await adminSevice.getRefreshToken(emailExistInData);

    const user = {
      _id: emailExistInData._id,
      username: emailExistInData.username,
    };

    res.json({
      user: emailExistInData,
      idToken: jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      refreshToken: refreshToken,
    });
  } else if (emailExistInData === null) {
    res.status(401);
    res.send("Sorry, you are not allowed to access this page!");
  }
};

exports.loginHandler = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const admin = await adminSevice.checkAdmin(email, password);
  console.log("loginHandler: " + req.headers.authorization);

  if (admin) {
    const refreshToken = await adminSevice.getRefreshToken(admin);
    const role = await adminSevice.getRole(admin._id);

    res.json({
      user: admin,
      token: jwt.sign(
        {
          _id: admin._id,
          username: admin.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        }
      ),
      refreshToken: refreshToken,
      role: role.roleId,
    });
    // res.status(401);
    // res.send("Sorry, you are not allowed to access this page!");
  } else {
    res.status(401);
    res.send("Sorry, you are not allowed to access this page!");
  }
};

exports.exchangeAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const refreshTokenInfo = await userService.getRefreshTokenInfo(refreshToken);
  console.log(refreshToken);

  if (!refreshTokenInfo) {
    res.status(403).json({
      message: "Refresh token is not found. Please make a new signin request.",
    });
    console.log("Refresh token is not found");
    return;
    ss;
  }

  if (userService.verifyExpiration(refreshTokenInfo)) {
    await userService.deleteRefreshToken(refreshTokenInfo.userId);

    res.status(403).json({
      message: "Refresh token was expired. Please make a new signin request.",
    });
    console.log("Refresh token was expired.");
    return;
  }

  const admin = await AdminAccount.findOne({ _id: refreshTokenInfo.userId });

  const newAccessToken = userService.createAccessToken(
    admin._id,
    admin.username
  );

  console.log("new access token: " + newAccessToken);

  res.status(200);
  res.json({
    //user: user,
    token: newAccessToken,
    //refreshToken: refreshToken,
  });
};

exports.logoutHandler = async (req, res, next) => {};

exports.getStatistics = async (req, res, next) => {
  console.log("getStatistics: " + req.headers.authorization);
  const classTotal = await adminSevice.getClassTotal();
  const userTotal = await adminSevice.getUserTotal();

  res.json({
    classTotal: classTotal,
    userTotal: userTotal,
  });
};

// exports.getAdminList = async (req, res, next) => {
//   const adminList = await adminSevice.getAdminList();
// };
