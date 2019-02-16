var db = require("../models");

module.exports = function(app) {
  //display adding new item form 
  app.get("/addItem", function(req,res){
    res.render("newItem");
  })

  // Load item for user using user ID NEED TO WORK ON THAT
  app.get("/userProfile", function(req, res) {
    db.Item.findAll({ where:  { userId: req.session.user.id } }).then(function(dbItem) {
      res.render("userProfile", {
        items: dbItem
      });
    });
  });
 // DELETE route for deleting posts
 app.delete("/api/posts/:id", function(req, res) {
  db.Item.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(dbItem) {
    res.json(dbItem);
  });
});

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
