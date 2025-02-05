const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken"); 


module.exports.registerUser =  async function (req, res){
    try {
      let { fullname, email, password } = req.body;
      let user = await userModel.findOne({email:email});
      if(user) return res.status(401).send ("You already have an account, please login..");



      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) return res.send(err.message);
          else {
            let user = await userModel.create({
              fullname,
              email,
              password: hash,
            });
           let token = generateToken(user);
            res.cookie("token", token);
  
            res.send("user created successfully");
          }
        });
      });
    } catch (err) {
      res.send(err.message);
    }
};
module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.send("Email or Password incorrect");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return res.status(500).send("Server error");
    }

    if (result) {
      let token = generateToken(user);
      res.cookie("token", token); // Set cookie before sending the response
      return res.send("You can login"); // Send the response once
    } else {
      return res.send("Email or Password incorrect");
    }
  });
};

module.exports.logout = function(req,res){
  res.cookie("token", "");
  res.redirect("/");
};