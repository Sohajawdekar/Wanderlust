
const User= require("../models/user.js");
module.exports.signupForm= async(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup= async(req,res)=>{
    try{
       
        let {email, username, password}= req.body;
        let newUser= new User({email,username});
        const regUser= await User.register(newUser, password);
        req.login(regUser, (err)=>{
            if(err){
                next(err);
            }else{
                req.flash("sucess", "User registered successfully")
                res.redirect("/Listings");

            }

        })
       
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm=  async(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login= async(req,res)=>{
   let redirectUrl= res.locals.redirectUrl||"/Listings"
    res.redirect(redirectUrl);
}

module.exports.logout=  async(req,res,next)=>{
    req.logout((err)=>{
    if(err){
     next(err);
    }
    req.flash("sucess", "User Logged out");
    res.redirect("/Listings");
    })
}