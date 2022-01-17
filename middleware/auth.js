const adminService = require("../components/Admin/adminService")

exports.isAdmin = async (req, res, next) => {
  // User.findById(req.session.userId).exec(function (error, user) {
  //   if (error) {
  //     return next(error);
  //   } else {
  //     if (user === null) {
  //       var err = new Error("Not authorized! Go back!");
  //       err.status = 401;
  //       return next(err);
  //     } else {
  //       return next();
  //     }
  //   }
  // });
  const isAdmin = await adminService.isAdmin(req.user)
  if (isAdmin) {
    console.log("admin")
    return next();
  } else {
    console.log("user")
    var err = new Error("Not authorized! Go back!");
    err.status = 401;
    return next(err);
  }
};
