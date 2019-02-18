require("dotenv").config();
var db = require("./models");
var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = db.users;
var path = require('path');
//************************************* */
//flash msg
const flash = require("flash-express");
//************* */
var app = express();
var PORT = process.env.PORT || 3000;

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandomstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// Middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express.static("public"));

// Make uploaded images available
app.use("/images", express.static('upload'));

// Handlebars
app.engine('handlebars', handlebars({
  extname: 'handlebars',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
// app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
// ****************flash****************
app.use(flash());


// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

var hbsContent = {
  user_email: '',
  loggedin: false
};

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {

    res.redirect('/index');
  } else {
    next();
  }
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});


// route for user signup
app.route('/signup')
  //.get(sessionChecker, (req, res) => {
  .get((req, res) => {
    //res.sendFile(__dirname + '/public/signup.html');
    res.render('signup', hbsContent);
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
        res.redirect('/signup');
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
          position:"b",
          duration:"3500"
        };
        res.flash("Please Enter Vaild Email and Password","error",option);
        res.redirect('/login');
      } else if (!user.validPassword(password)) {
        res.redirect('/index');
      } else {
        req.session.user = user.dataValues;
        res.redirect('/index');
      }
    });
  });


// route for user's index
app.get('/index', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    hbsContent.loggedin = true;
    hbsContent.user_email = req.session.user.user_email;
    console.log(req.session.user.user_email);
    var option = {
      position:"t",
      duration:"3500"
    };
    res.flash("You are logged In",'info', option)
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
      position:"t",
      duration:"3500"
    };
    res.flash("You are logged out!",'info', option)
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;