const express = require("express")
const router = express.Router();
const {signin,signup,signout, isSignedIn} = require("../controllers/authenticate");
const { check } = require('express-validator');

//Sign-in
router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password is required").isLength({min:3})
],signin);
//Sign-up
router.post("/signup",[
    check("name","name should be atleast 3 letters").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 3 letters").isLength({min:3})
],signup);
//Sign-out
router.get("/signout",signout);

router.get("/testRoute",isSignedIn,(req,res)=>{
    res.json(req.auth);
})
module.exports = router;