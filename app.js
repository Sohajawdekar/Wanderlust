// if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
// }

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");
const methodOverride = require('method-override');


const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const dbUrl= process.env.ATLAS_DBURL;
console.log(dbUrl);
app.listen(3000, () => {
  console.log("listening from", 3000);
})
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then((res) => { console.log("connected to db") })
  .catch(err => console.log("not found"));

  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter: 24*3600
  });
  store.on("error", ()=>{
    console.log("error in mongo session store", err)
  })

const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true
  }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.sucess= req.flash("sucess");
  res.locals.error= req.flash("error");
  res.locals.CurrUser= req.user;
   //console.log(res.locals.sucess);
  next();
})

app.get("/demouser", async(req,res)=>{
  const user= new User({
    email: "soha@gmail.com",
    username: "makhna"
  });
  const newUser= await User.register(user,"bottle");
  console.log(newUser);
  res.send("registered");
})

app.use("/Listings", listingRouter);
app.use("/",reviewRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err })
  // res.status(statusCode).send(message);
})




















