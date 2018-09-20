require('rootpath')();
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
var session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var path = require('path')
var db = require('_helpers/db');
var User = db.User;
var tracker = require('_helpers/Tracker.js');
var Tracker = tracker.Tracker;
var dataQuery = require('_helpers/dataAnalysticsQuery.js');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'AWESOMESECRETTOSECUREMYAPP',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/index.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;
        console.log(username, password);
        User.findOne({ username }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (! (user && bcrypt.compareSync(password, user.hash))) {
                res.redirect('/login');
            } else {
                user.loginActivity.push(new Date().toString());
                user.save();
                req.session.user = user;
                res.redirect('/dashboard');
            }
        });
    });

app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/views/signup.html');
    })
    .post((req, res) => {
      // var username = req.body.username;
      // User.findOne({ username: req.body.username }).then(function (user123) {
      //   console.log(user123);
      //     if(user123 = null) {
      //         res.json({message : 'Username "' + req.body.username + '" is already taken'});
      //     }
      // });
        const user = new User(req.body);

        // hash password
        if (req.body.password) {
            user.hash = bcrypt.hashSync(req.body.password, 10);
        }

        // save user
        user.save();
        req.session.user = user;
        res.redirect('/dashboard');
    });

// route for user's dashboard
app.use('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/views/homepage.html');
    } else {
        res.redirect('/login');
    }
});

app.use('/VisualizationPage', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.sendFile(__dirname + '/views/visualization.html');
  } else {
      res.redirect('/login');
  }
});

// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.post('/getSessionData', (req, res) => {
  // console.log(req.session.user);
  if (req.session.user && req.cookies.user_sid) {
      res.json(req.session.user);
  } else {
      res.redirect('/login');
  }
});

app.use('/getSessionJS', (req, res) => {
  res.sendFile(path.join(__dirname,'public/controller','getSessionData.js'));
});

app.use('/getVisualizationJS', (req, res) => {
  res.sendFile(path.join(__dirname,'public/controller','visualization.js'));
});

app.use('/getVisualizationAJAXJS', (req, res) => {
  res.sendFile(path.join(__dirname,'public/controller','visulizeAjax.js'));
});




app.use('/getVisualizationData', (req, res) => {
  if (!(req.session.user && req.cookies.user_sid)) {
      res.redirect('/login');
  }
  console.log(req.body);
  dataQuery.getTagFrequencyByUser(req, res);
});

app.post('/logEvent', (req, res) => {
  console.log("Log event request received!!");
  if (req.session.user && req.cookies.user_sid) {
      data = req.body;
      var logEvent = Tracker({
        username: req.session.user.username,
        TimeStamp:  data.timestamp,
        log_event: data.log_event,
        page_url: data.url,
        tags: JSON.parse(data.tags),
        parameters: JSON.parse(data.parameters)

      });
      logEvent.save();
      console.log(logEvent);
      res.json({message: 'event logged'});
  } else {
      res.json({message: 'User not registered'});
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// use JWT auth to secure the api
// app.use(jwt());

// api routes
// app.use('/users', require('./users/users.controller'));



// global error handler
app.use(errorHandler);

// start server
const port = 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
