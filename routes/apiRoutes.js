var db = require("../models");
var multer = require("multer");
var aws = require("aws-sdk");
var multerS3 = require("multer-s3");
var User = db.users;

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

var s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});
var useS3;
var storage;

if (!process.env.S3_KEY) {
  useS3 = false;
  console.log("No S3 Key available. Using local upload");
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload");
    },
    filename: function (req, file, cb) {
      // Make the filename unique by adding a timestamp
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  });
} else {
  useS3 = true;
  console.log("Using S3 key: " + process.env.S3_KEY);
  storage = multerS3({
    s3: s3,
    bucket: "phoenix-project2",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  });
}

var upload = multer({
  storage: storage
});

module.exports = function (app) {
  // Get all items
  app.get("/api/item", function (req, res) {

    db.Item.findAll({}).then(function (dbItem) {
      res.json(dbItem);
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("You are logged In", 'info', option);
    });

  });

  // This post needs to be handled by multer for the file upload
  app.post("/api/newItem", upload.single("myImage"), function (req, res) {
    console.log(req.body);
    console.log(req.file);

    var image;
    if (!req.file) {
      // If no file was selected we use a placeholder
      image = "/images/placeholder.png";
    } else if (useS3) {
      image = req.file.location;
    } else {
      image = "/images/" + req.file.filename;
    }

    db.Item.create({
      title: req.body.title,
      categories: req.body.categories,
      description: req.body.description,
      price: req.body.price,
      sellerContact: req.body.sellerContact,
      image: image,
      userId: req.session.user.id
    }).then(function () {
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("Your Item Successfuly Added!", 'info', option)
      res.redirect("/");
    });
  });

  app.post("/api/signUp", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    });
  });

//delete item
app.post("/",function (req, res) {
 db.Item.destroy(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(function () {
      res.redirect("/");
      var option = {
        position: "t",
        duration: "3500"
      };
      res.flash("Your Item Successfuly Deleted!", 'info', option)
      // res.json(dbItem);
    });
});



  //update item
  app.post("/item/update/:id", upload.single("myImage"), function (req, res) {
    if (useS3) {
      req.body.image = req.file.location;
    } else {
      req.body.image = "/images/" + req.file.filename;
    }
    console.log(req.body);

    db.Item.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      .then(function () {
        res.redirect("/userProfile");
        var option = {
          position: "t",
          duration: "3500"
        };
        res.flash("Your Item Successfuly Updated!", 'info', option)
        // res.json(dbItem);
      });
  });

  // route for user signup
  app.route('/signUp')
    .get((req, res) => {
      res.render('signUp', hbsContent);
    })
    .post((req, res) => {
      User.create({
          user_email: req.body.user_email,
          password: req.body.password
        })
        .then(user => {
          req.session.user = user.dataValues;
          res.redirect('/login');
        })
        .catch(error => {
          res.redirect('/signUp');
        });
    });
  // route for user Login
  app.route('/login')
    .get(sessionChecker, (req, res) => {
      res.render('login', hbsContent);
    })
    .post((req, res) => {
      var user_email = req.body.user_email,
        password = req.body.password;
      User.findOne({
        where: {
          user_email: user_email
        }
      }).then(function (user) {
        if (!user) {
          console.log("line 147");
          var option = {
            position: "b",
            duration: "3500"
          };
          res.flash("Please Enter Vaild Email and Password", "error", option);
          res.redirect('/login');
        } else if (!user.validPassword(password)) {
          res.redirect('/index');
        } else {
          req.session.user = user.dataValues;
          res.redirect('/index');
        }
      });
    });

};