var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
// + npm install hbs
var passport = require('passport');

// ORMhez importált modulok
var Waterline = require('waterline');
var waterlineConfig = require('./config/waterline');
// ORM példány
var orm = new Waterline();
var errorCollection = require('./models/subject');
var userCollection = require('./models/user');
var usCollection = require('./models/usrelation');
orm.loadCollection(Waterline.Collection.extend(errorCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));
orm.loadCollection(Waterline.Collection.extend(usCollection));

//var errorController = require('./controllers/error');
var indexController = require('./controllers/index');
var loginController = require('./controllers/login');
var teacherController = require('./controllers/teacher');
var studentController = require('./controllers/student');
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize()); //Passport middlewares
app.use(passport.session()); //Session esetén (opcionális)

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
})

var LocalStrategy = require('passport-local').Strategy;

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező neptun.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}
app.use(setLocalsForLayout());

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'neptun',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, neptun, password, done) {
        req.app.models.user.findOne({ neptun: neptun }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            req.session.currentuser = user;
            
            return done(null, user);
        });
    }
));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

//endpoints
app.use('/', indexController);
//app.use('/errors', ensureAuthenticated, errorController);
app.use('/login', loginController);
app.use('/teacher',ensureAuthenticated,teacherController);
app.use('/student',ensureAuthenticated,studentController);

function andRestrictTo(role) {
    return function(req, res, next,done) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    };
}


// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});

