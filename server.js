require("dotenv").config();
var db = require("./models");
var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
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
    expires: 6000000000
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
// require("./public/js/index")(app);

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

