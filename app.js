var express = require('express'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
const {sequelize} = require("./models"); // require sequelize 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Testing Connection to database
(async ()=>{
    console.log("Testing connection to the Database")
    try{
      sequelize.authenticate();
      console.log("Connecting Successfully!")
    }catch(err){
      console.log("Database Connection Fails!")
    }
})()

//Catch the Error
app.use((req,res,next)=>{
  const error = new Error("The page you are looking for is not exist,Please try again..."); // create new error object on message
  error.status = 404; // set error status to 404
  next(error); // pass error object to error handler middleware
})


app.use((err,req,res,next)=>{
    res.status(err.status || 500) // set default error status 500 
    if(res.statusCode === 404){
      // if it's error 404
      res.render("page_not_found",{err}) // render page_not_found template
    }else{
      // if it's error 500 or something else
      err.message = "The Server Server is occurs,Please double you code or start the code again later on!"; // define the error message 
      res.render("error",{message: err.message, error: err}); // render error template
      console.log(err.status,err.message); // console the error status and it's error message
    }
})

module.exports = app;
