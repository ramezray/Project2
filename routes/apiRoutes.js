var db = require("../models");

module.exports = function(app) {
  // Get all items
  app.get("/api/item", function(req, res) {
    db.Item.findAll({}).then(function(dbItem) {
      res.json(dbItem);
    });
  });

  // Create a new item
  app.post("/api/newItem", function(req, res) {
    db.Item.create(req.body).then(res.redirect("/"));
  });

  app.post("/api/signUp", function(req, res) {
    db.User.findAll({}).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // Delete an item by id
  app.delete("/api/item/:id", function(req, res) {
    db.Item.destroy({ where: { id: req.params.id } }).then(function(dbItem) {
      res.json(dbItem);
    });
  });
};
