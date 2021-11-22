const bcrypt = require('bcrypt');

const userModel = require('./userModel');
const mongoose = require('mongoose');
const saltRounds = 10;

exports.hashPassword = async (password)=>{
    const password_hash = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return password_hash;
}

exports.createNewUser = async (data) => {
    const userInfo = {
      username: data.username,
      password: data.password,
      email: data.email,
    }
    const newUser = new userModel(userInfo);
  
    await newUser.save();
  
    return newUser._id;
  }



// passport needs to use these functions
exports.passportSignIn=(req, res, next) =>{
    console.log(req);
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json("Block")}
        req.logIn(user, function(err) 
        {
          if (err) { return next(err); }
  
          let url = req.query.retURL;
          if(!url)
          {
              url="/";
          }
            
      
          return res.redirect(url);
        });
      })(req, res, next);
}


exports.checkUser = async (username, password) => {
    const user = await userModel.findOne({ username: username })

    console.log(user);
    if (!user) {
        return false;
    }
    let checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
        return user._id;
    }

    return false;
}  


exports.getUser = async (id) => {
    return await userModel.findOne({ _id: id });
}