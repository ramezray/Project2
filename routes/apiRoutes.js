var db = require("../models");
var multer = require("multer");
var aws = require("aws-sdk");
var multerS3 = require("multer-s3");
let itemID = require("../models/item")

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
        position:"t",
        duration:"3500"
      };
      res.flash("You are logged In",'info', option);
    });
  });

  // This post needs to be handled by multer for the file upload
  app.post("/api/newItem", upload.single("myImage"), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    // req.body contains the text fields
    // add image path to body

    if (useS3) {
      req.body.image = req.file.location;
    } else {
      req.body.image = "/images/" + req.file.filename;
    }
    console.log(req.body);
    // db.Item.create(req.body).then(res.redirect("/"));
    db.Item.create({
      title: req.body.title,
      categories: req.body.categories,
      description: req.body.description,
      price: req.body.price,
      sellerContact: req.body.sellerContact,
      image: !req.file ? 'placeholder.jpg' : req.body.image,
      userId: req.session.user.id
    }).then(function () {
      var option = {
        position:"t",
        duration:"3500"
      };
      res.flash("Your Item Successfuly Added!",'info', option)
      res.redirect("/");
    });
  });

  app.post("/api/signUp", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // Delete an item by id
  app.delete("/api/item/:id", function (req, res) {
    db.Item.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbItem) {
      res.json(dbItem);
    });
  });




  //update item
  // app.post("/item/update/:id", upload.single("myImage"), function (req, res) {
  //   // console.log(req.body);
  //   // console.log(req.file);
  //   console.log(req.params.Item.id);
    
  //   // req.body contains the text fields
  //   // add image path to body

  //   // if (useS3) {
  //   //   req.body.image = req.file.location;
  //   // } else {
  //   //   req.body.image = "/images/" + req.file.filename;
  //   // }
  //   console.log(req.body);
  //   db.Item.update(req.body,
  //     {
  //       where: {
  //         title: req.body.title
  //       }
  //     })
  //     .then(function(dbItem) {
  //       res.json(dbItem);
  //     });
  // });

};