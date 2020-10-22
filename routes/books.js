var express = require('express');
var router = express.Router();
const {Book} = require("../models") // require Book models 
const {Op} = require("sequelize"); // require sequelize Operator 

// Async Handler Function 
function asyncHandler(cb){
  return async (req,res,next)=>{
    try{
      await cb(req,res,next);
    }catch(err){
      next(err)
    }
  }
}

/* GET users listing. */

// get /books route 
router.get('/', asyncHandler(async (req,res)=>{
  const allBooks = await Book.findAll(); // store books data into allBooks
  res.locals.isHome = false; // hide the Back To List button 
  res.locals.isOnSearch = false; // show all search type options 
  res.locals.useJS = true; // use javascript script tag 
  res.render("index",{title:"Books",allBooks}); // render index 
}));

// get /books/new route
router.get("/new",asyncHandler(async (req,res)=>{
    res.locals.title = "New Book"; // set title to New Book
    res.locals.useJS = false; // hide the script tag 
    res.render("new_book"); // render new book template 
}));


// post /books/new route 
router.post("/new",asyncHandler(async (req,res)=>{
  try{
    // create a new books with create()
    await Book.create(req.body);
    res.redirect("/"); // redirect it to /books route
  }catch(err){
    // if error occurs 
    if(err.name === "SequelizeValidationError"){
      // handler validation error 
      const error = err.errors;
      const errorMessage = error.map(data => data.message) // store all error message
      res.render("form_error",{currentData: req.body,title:"New Book", errors: errorMessage}); // render form_error and display all error message
    }else{
      // throw regular error
      throw err;
    }
  }
}));

// get /books/:id route 
router.get("/:id",asyncHandler(async (req,res,next)=>{
    res.locals.title = "Update Book"; // set book title
    res.locals.useJS = false // hide the script tag
    const currentData = await Book.findByPk(req.params.id); // grab update's books data 
    if(currentData){
      // if update books is exist 
      res.render("update_book",{currentData}) // render update book template 
    }else{
      // update books is not exist 
      // create new error and throw the error of status to 404
      const error = new Error();
      error.status = 404;
      next(error);
    }
}));

// post /books/:id route
router.post("/:id",asyncHandler(async (req,res,next)=>{
    try{
      // if not error is occurs update the books 
      const bookNeedsUpdate = await Book.findByPk(req.params.id);
      await bookNeedsUpdate.update(req.body);
      res.redirect("/"); // redirect to /books routes
    }catch(err){
      // if error occurs 
      if(err.name === "SequelizeValidationError"){
        //handle the validation error 
        const error = err.errors;
        const errorMessage = error.map(data => data.message) // store all error message
        res.render("form_error",{currentData:req.body,title:"Update Book",errors: errorMessage}) // render form_error and display all error message
      }else{
        // throw regular error
        throw err;
      }
    }
}));

// post /books/:id/delete route 
router.post("/:id/delete",asyncHandler(async (req,res)=>{
    const bookNeedsDelete = await Book.findByPk(req.params.id);
    await bookNeedsDelete.destroy(); // delete the books data 
    res.render("deleted",{title: "Book Deleted",bookNeedsDelete}); // render delete template
}));

// display the form search results 
router.get("/search/:type/:value",asyncHandler(async (req,res)=>{

    const columnValue = req.params.type; // store the search genre  
    const rowValue = req.params.value;  // store the search value 
    res.locals.isHome = true; // show the Back to List button
    res.locals.isOnSearch = true; // show only the search genre on select tags
    res.locals.searchType = columnValue.charAt(0).toUpperCase() + columnValue.slice(1); // capitalize search genre
    if(columnValue === "title"){
      // handle on search genre with title 
      const searchBook = await Book.findAll({
        where :{
          // search the words that is contains with the search value use sequelize Op.substring
          [columnValue] : {
            [Op.substring]: `${rowValue}`
          }
        }
      })
      res.render("index",{title:"Books",allBooks:searchBook});
    }else{
      // handle other genre search
      const searchBook = await Book.findAll({
        where :{
          [columnValue] : `${rowValue}`
        }
      })
  
      res.render("index",{title:"Books",allBooks:searchBook});
    }
}))

module.exports = router;
