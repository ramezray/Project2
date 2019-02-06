var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Item.findAll({}).then(function(dbItem) {
      res.render("index", {
        msg: "Welcome!",
        items: dbItem
      });
    });
  });

  app.get("/login", function(req,res){
    res.render("login");
  });

  //display adding new item form 
  app.get("/addItem", function(req,res){
    res.render("newItem");
  })

  // Load item for user using user ID NEED TO WORK ON THAT
  app.get("/userProfile", function(req, res) {
    db.Item.findAll({}).then(function(dbItem) {
      res.render("userProfile", {
        msg: "Welcome!",
        items: dbItem
      });
    });
  });

  // Load item page and pass in an item by id
  app.get("/item/:id", function(req, res) {
    db.Item.findOne({ where: { id: req.params.id } }).then(function(dbItem) {
      res.render("item", {
        item: dbItem
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
