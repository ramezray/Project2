var db = require("../models");

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {

    res.redirect('/index');
  } else {
    next();
  }
};

var hbsContent = {
  user_email: '',
  loggedin: false
};

module.exports = function (app) {
  //display adding new item form 
  app.get("/addItem", function (req, res) {
    res.render("newItem");
  })

  // Load item for user using user ID NEED TO WORK ON THAT
  app.get("/userProfile", function (req, res) {
    db.Item.findAll({
      where: {
        userId: req.session.user.id
      }
    }).then(function (dbItem) {
      res.render("userProfile", {
        items: dbItem
      });
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("You Can Update OR Delete Your Items!", 'warn', option);
    });
  });



  // Load item page and pass in an item by id
  app.get("/oneItem/:id", function (req, res) {
    db.Item.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbItem) {
      res.render("oneItem", {
        item: dbItem
      });
    });
  });

  //load update form with data in it
  app.get("/item/update/:id", function (req, res) {
    db.Item.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbItem) {
      res.render("updateItem", {
        item: dbItem
      });
    });
  });

  // route for Home-Page
  app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
  });
  // route for user's index
  app.get('/index', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      hbsContent.loggedin = true;
      hbsContent.user_email = req.session.user.user_email;
      console.log(req.session.user.user_email);
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("You are logged In", 'info', option);
      db.Item.findAll({}).then(function (dbItem) {
        res.render("index", {
          items: dbItem
        });
      });
    } else {
      res.redirect('/login');
    }
  });

  // route for user logout
  app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      hbsContent.loggedin = false;
      res.clearCookie('user_sid');
      console.log(JSON.stringify(hbsContent));
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("You are logged out!", 'info', option)
      res.redirect('/');
    } else {
      res.redirect('/login');
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("You are logged out!", 'info', option);
      res.redirect('/');
    }
  });


  // //Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("/404");
  // });
};