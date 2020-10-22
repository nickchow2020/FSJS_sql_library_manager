var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
const {sequelize} = require("./models");

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


(async ()=>{
    console.log("Testing connection to the Database")
    try{
      sequelize.authenticate();
      console.log("Connecting Successfully!")
    }catch(err){
      console.log("Database Connection Fails!")
    }
})()


app.use((req,res,next)=>{
  const error = new Error("The page you are looking for is not exist,Please try again...");
  error.status = 404;
  next(error);
})


app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    if(res.statusCode === 404){
      res.render("page_not_found",{err})
    }else{
      err.message = "The Server Server is occurs,Please double you code or start the code again later on!";
      res.render("error",{message: err.message, error: err});
      console.log(err.status,err.message);
    }
})

module.exports = app;
