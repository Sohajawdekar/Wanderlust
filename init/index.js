const express= require("express");
const app= express();
const path= require("path");
const mongoose = require('mongoose');
const Listing= require("../models/listings.js");
// var methodOverride = require('method-override');
// app.use(methodOverride('_method'));
const initData= require("./data.js");
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
let port=3000;
app.listen(port, ()=>{
    console.log("listening from", port);
})
const dbUrl= "mongodb+srv://sohajawdekar:eNQAo8djwcTw9Guk@cluster0.zof47mb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
console.log(dbUrl)
async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then((res)=>{console.log("connected to db")})
.catch(err => console.log("not found"));

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner:"67e861fbd44690b33cfcd0e3"}))
    
    await Listing.insertMany(initData.data);
    console.log("db initialised")
}
initDB();