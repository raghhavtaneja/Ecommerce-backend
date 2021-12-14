const User = require("../models/user");
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signin = (req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    User.findOne({email},(err,user)=>{
        if(err || !user) return res.status(400).json({
            error : "user not found"
        });

        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "email and password don't match"
            });
        }

        //Create token
        const token = jwt.sign({ _id : user._id }, process.env.SECRET );
        //Put token in cookie
        res.cookie("token",token,{expire: new Date() + 9999});
        //Send response to frontent
        const {_id,name,email,role} = user;
        return res.json({
            token,
            user: {_id,name,email,role}
        });
    });
}

exports.signup = (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const user = new User(req.body);
    if(User.find({username:req.body.username})){
        return res.status(422).json({
            err:"User already registered"
        })
    }
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:"Not able to save user in db"
            });
        }
        res.json({
            name : user.name,
            email : user.email
        });
    });
};

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message : "user signout success!"
    });
};

//protected routes - checker for tokens
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

//custom middlewares
//user owns this account
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"Accedd Denied!"
        });
    }
    next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        res.status(403).json({
            error:"You are not the Admin! Access Denied"
        })
    }
    next();
}