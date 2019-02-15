var db = require("../models");

module.exports = function(app) {
  //display adding new item form 
  app.get("/addItem", function(req,res){
    res.render("newItem");
  })

  // Load item for user using user ID NEED TO WORK ON THAT
  app.get("/userProfile", function(req, res) {
    db.Item.findAll({}).then(function(dbItem) {
      res.render("userProfile", {
        items: dbItem
      });
    });
  });



  // Load index page
  // app.get("/index", function(req, res) {
  //   db.Item.findAll({}).then(function(dbItem) {
  //     res.render("index", {
  //       items: dbItem
  //     });
  //   });
  // });
//render login HTML page
  // app.get("/login", function(req,res){
  //   res.render("login");
  // });
  // //render signUp HTML page
  // app.get("/signup", function(req,res){
  //   res.render("signUp");
  // });

  // Load item page and pass in an item by id
  app.get("/oneItem/:id", function(req, res) {
    db.Item.findOne({ where: { id: req.params.id } }).then(function(dbItem) {
      res.render("oneItem", {
        item: dbItem
      });
    });
  });

  //Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
