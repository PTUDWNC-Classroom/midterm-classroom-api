const bcrypt = require("bcrypt")
const saltRounds = 10
const adminModel = require("./adminModel")
const userModel = require("../components/User/userModel")
const classModel = require("../components/classes/classesModel")
exports.isExistInData = async(userInfo)=>
{
    // Lấy danh sách admin
    const adminList = await adminModel.find();

    // So sánh các admin trong ds với userInfo
    let result = false;
    let isAdmin = null;
    for(let admin of adminList)
    {
        if(admin.username === userInfo.username)
        {
            result = await bcrypt.compare(userInfo.password, admin.password)
            if(result)
            {
                isAdmin = admin
            }
        }
    }

    return isAdmin;
}

exports.getAdminData = async(userInfo)=>
{
    // Lấy danh sách admin
    const adminList = await adminModel.find();


    return adminList;
}

exports.getUserData = async(userInfo)=>
{
    // Lấy danh sách user
    const userList = await userModel.find();


    return userList;
}

exports.getClassData = async(userInfo)=>
{
    // Lấy danh sách lớp
    const classList = await classModel.Classes.find();

    return classList;
}