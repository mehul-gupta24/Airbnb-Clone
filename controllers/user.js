const User = require("../models/user");

module.exports.renderSignup = async(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.renderLogin = async(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.signup = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        // console.log("password is ",password)
        // console.log("password is " +password)
        const newUser=new User({email,username});
        let newSignedUser = await User.register(newUser,password)
        req.login(newSignedUser , (err)=>{
            if(err){
                return next();
            }
            req.flash("success","User signed in successfully")
            // console.log(newSignedUser)
            res.redirect('/listings')
        })
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect('/signup')
        
    }
}

module.exports.login = async(req,res)=>{
    // res.send("you are logged in")
    // const onURL = req.originalUrl;
    req.flash("success","User Logged In")
    if(res.locals.redirectUrl) return res.redirect(`${res.locals.redirectUrl}`)
    res.redirect('/listings')
}

module.exports.logout = async (req,res) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","User logout Successfully!")
        res.redirect('/listings')
    })
}