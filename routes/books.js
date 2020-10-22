var express = require('express');
var router = express.Router();
const {Book} = require("../models")
const {Op} = require("sequelize");

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
router.get('/', asyncHandler(async (req,res)=>{
  const allBooks = await Book.findAll();
  res.locals.isHome = false;
  res.locals.isOnSearch = false;
  res.render("index",{title:"Books",allBooks});
}));

router.get("/new",asyncHandler(async (req,res)=>{
    res.locals.title = "New Book";
    res.render("new_book");
}));

router.post("/new",asyncHandler(async (req,res)=>{
  try{
    await Book.create(req.body);
    res.redirect("/");
  }catch(err){
    if(err.name === "SequelizeValidationError"){
      const error = err.errors;
      const errorMessage = error.map(data => data.message)
      res.render("form_error",{currentData: req.body,title:"New Book", errors: errorMessage});
    }else{
      throw err;
    }
  }
}));


router.get("/:id",asyncHandler(async (req,res,next)=>{
    res.locals.title = "Update Book";
    const currentData = await Book.findByPk(req.params.id);
    if(currentData){
      res.render("update_book",{currentData})
    }else{
      const error = new Error();
      error.status = 404;
      next(error);
    }
}));


router.post("/:id",asyncHandler(async (req,res,next)=>{
    try{
      const bookNeedsUpdate = await Book.findByPk(req.params.id);
      await bookNeedsUpdate.update(req.body);
      res.render("update_book",{title: "Update Book", currentData: bookNeedsUpdate});
    }catch(err){
      if(err.name === "SequelizeValidationError"){
        const error = err.errors;
        const errorMessage = error.map(data => data.message)
        res.render("form_error",{currentData:req.body,title:"Update Book",errors: errorMessage})
      }else{
        throw err;
      }
    }
}));


router.post("/:id/delete",asyncHandler(async (req,res)=>{
    const bookNeedsDelete = await Book.findByPk(req.params.id);
    await bookNeedsDelete.destroy();
    res.render("deleted",{title: "Book Deleted",bookNeedsDelete});
}));


router.get("/search/:type/:value",asyncHandler(async (req,res)=>{

    const columnValue = req.params.type;
    const rowValue = req.params.value;
    res.locals.isHome = true;
    res.locals.isOnSearch = true;
    res.locals.searchType = columnValue.charAt(0).toUpperCase() + columnValue.slice(1);
    if(columnValue === "title"){
      const searchBook = await Book.findAll({
        where :{
          [columnValue] : {
            [Op.substring]: `${rowValue}`
          }
        }
      })
      res.render("index",{title:"Books",allBooks:searchBook});
    }else{
      const searchBook = await Book.findAll({
        where :{
          [columnValue] : `${rowValue}`
        }
      })
  
      res.render("index",{title:"Books",allBooks:searchBook});
    }
}))

module.exports = router;
