const adminService = require("./adminService")

// const password = await new Promise((resolve, reject) => {
//     bcrypt.hash("admin", saltRounds, function (err, hash) {
//         if (err) reject(err)
//         resolve(hash)
//     })
// })
// const userInfo = {
//     username: "admin",
//     password: password,
//     email: "lyhandong123@gmail.com",
//     dateCreate: new Date()
// }

// const newUser = new adminModel(userInfo)

// await newUser.save()

// return newUser._id

exports.signInHandler = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * username
     * password
     */

    // Kiểm tra admin có trong data không
    const result = await adminService.isExistInData(userInfo);

    res.json(result)
}

exports.getAdminData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getAdminData(userInfo);

    res.json(result)
}

exports.getUserData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getUserData(userInfo);

    res.json(result)
}

exports.getClassData = async (req, res, next) => {
    const userInfo = req.body;
    console.log(userInfo)
    /**
     * user
     */

    // Lấy admin account trong cơ sở dữ liệu 
    const result = await adminService.getClassData(userInfo);

    res.json(result)
}