if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}
console.log(process.env.SECRET)

const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const MongoStore = require("connect-mongo")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport") //its a express compatible authentication middleware
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const userRoute = require('./routes/user.js');
const listingRoute = require('./routes/listing');
const reviewsRoute = require('./routes/reviews');

// Connect to DataBase
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
    console.log("Connected to Database");
}

main().then(()=>{
    console.log("MongoDB connection established successfully with wanderlust database");
}).catch((err)=>{
    console.log("Failed to connect to MongoDB", err);
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    touchAfter:24 * 3600,
})

store.on("error",(err)=>{
    console.log("Error on MongoStore",err)
})


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires:Date.now()+1000*3600*24*7,
        maxAge : 1000*3600*24*7,
        httpOnly : true
    }
}

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions)) //for storing session info
app.use(flash()) //only after sessions

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUserStatus = req.user;
    // res.locals.redirectUrl = req.originalUrl;
    // res.locals.URL = req.path;
    // console.log(res.locals.success)
    next();
})

// app.get('/demouser',async(req,res)=>{
//     let fakeUser = new User({
//         email:"fake123@gmail.com",
//         username:"John"
//     })
//     // await fakeUser.save()
//     // pbdkf2 algorithm is used for hashing
//     let newRegisteredUser = await User.register(fakeUser , "myPassword")
//     res.send(newRegisteredUser)
// })
// app.get('/deletedemouser',async(req,res)=>{
//     await User.deleteMany({});
//     res.send("deleted")
// })


// Routes
app.get('/', (req, res) => res.redirect('/listings'));
app.use('/',userRoute)
app.use('/listings',listingRoute)
app.use('/listings/:id/reviews',reviewsRoute)

// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"))
// })

// app.use((err,req,res,next)=>{
// let {statusCode=500,message="Default Error Wrong"}=err;
// // res.send("Something went wrong!!")
// // res.status(statusCode).send(message)
//     res.render("error.ejs",{err})
// })
app.use((err,req,res,next)=>{
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    
    let {statusCode=500,message="Default Error Wrong"}=err;
    
    // Try to render error page, but have a fallback if rendering fails
    try {
        res.status(statusCode).render("error.ejs",{err})
    } catch (renderError) {
        // If rendering fails, send a simple error message
        res.status(statusCode).send(message || "Something went wrong!");
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`${dbUrl}`);
})
