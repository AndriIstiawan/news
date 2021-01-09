const bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    express = require('express'),
    cors = require('cors');
// Config File
const CONFIG = require('./config/config');

const apiArContentRoute = require('./components/arcontents/arcontentsRouteAPI'),
    apiUserAuthRoute = require('./components/auth/authRouteAPI'),
    apiStatusRoute = require('./components/status/statusRouteAPI'),
    apiNewsRoute = require('./components/news/newsRouteAPI'),
    apiSecretRoute = require('./components/users/usersRouteAPI');

const dbConnBuilder = require('./_helpers/db_conn_builder');
const dbTestingConnBuilder = require('./_helpers/db_testing_conn_builder');
const app = express();

// App setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App config
app.use(methodOverride('_method')); // has to be declared before any route
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, sid'
    );
    res.header(
        'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT'
    );
    next();
});

// Passport Dependencies
const User = require('./components/users/usersModel');
const passportJWT = require('passport-jwt');
const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
// Passport initialize for local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    User.authenticate()
));
// Inject User model with serializing & deserializing, or login and logout capabilities
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Passport initialize for JWT strategy
passport.use(new JWTstrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'super-secret-token'
},
    function (jwtPayload, cb) {
        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

// Log the environment
console.log('Environment:', CONFIG.app);
console.log('NODE_ENV:', process.env.NODE_ENV);

mongoose.Promise = global.Promise;
// DB Setup
if (process.env.NODE_ENV === 'test') {
    dbTestingConnBuilder()
} else {
    const dbConnUri = dbConnBuilder(CONFIG);
    console.log('Connection URI:', dbConnUri);
    mongoose.connect(dbConnUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
    mongoose.connection.on('error', error => console.log(error));
}

// Main App Route
app.get('/', function (req, res) {
    res.json({ message: "This is the api server main route", status: "OK" });
});
// API Routes
app.use('/api/v1/', apiArContentRoute);
app.use('/api/v1/', apiNewsRoute);
app.use('/api/v1/', apiStatusRoute);
app.use('/api/v1/auth/', apiUserAuthRoute);
app.use('/api/v1/user/', passport.authenticate('jwt', { session: false }), apiSecretRoute);

app.listen(process.env.PORT || 4000, function () {
    console.log('Application is running.. ');
    console.log(`Open in your browser ${CONFIG.ip_address}`);
});

module.exports = app;
