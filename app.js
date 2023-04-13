const express = require("express");
const request = require("request");
const tba = require("./tba");
const db = require("./my-sql");
var bodyParser = require('body-parser');
var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');

const app = express();
const httpPort = 3000;

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'convergence'
}));

var users = {
    tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
    if (err) throw err;
    // store the salt & hash in the "db"
    users.tj.salt = salt;
    users.tj.hash = hash;
});


var eventName;
var eventKey;
var number;
var weight;
var height;
var length;
var width;
var drivetrain;
var drivetrain_motors;
var free_speed;
var element_pickup;
var element_scoring;
var hang_charge_station;
var start_position;
var auto_balence;

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/img"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


//Index Page
app.get("/", function (req, res) {
    res.render("homepage");
})

//Pit Scouting GET
app.get("/pit_scouting", function (req, res) {
    res.render("pit_scouting");
})

//Pit Scouting POST
app.post('/pit_scouting', function (req, res, next) {
    var data = req.body;
    console.log(data);

    number = `${data.teamNumberInput}`;
    weight = `${data.teamWeightInput}`;
    height = `${data.teamHeightInput}`;
    length = `${data.teamLengthInput}`;
    width = `${data.teamWidthInput}`;
    drivetrain = `${data.robotDrivetrain}`;
    drivetrain_motors = `${data.robotDrivetrainMotors}`;
    free_speed = `${data.robotFreespeedinput}`;
    element_pickup = `${data.gameElementPickup}`;
    element_scoring = `${data.gameElementScoring}`;
    hang_charge_station = `${data.hangOffChargeStation}`;
    start_position = `${data.autoStartPosition}`;
    auto_balence = `${data.autoBalance}`;

    db.createNewEventDatabase(eventName);
    db.insertTeamData(number, weight, height, length, width, drivetrain, drivetrain_motors, free_speed, element_pickup, element_scoring, hang_charge_station, start_position, auto_balence);

    res.redirect('/pit_scouting');
})

app.post('/', function (req, res, next) {
    console.log(req.body);
});


//Match Scout GET
app.get("/match_scouting", function (req, res) {
    res.render("match_scouting");
})

//Match Scout POST
app.post('/match_scouting', function (req, res, next) {
    var data = req.body;
    console.log(data);

    number = `${data.teamNumberInput}`;
    match = `${data.matchNumberInput}`;
    placement = `${data.autoPlacement}`;
    mobility = `${data.autoMobility}`;
    autoBalance = `${data.autoBalance}`;
    coneHigh = `${data.autoConeHighScore}`;
    coneLow = `${data.autoConeLowScore}`;
    cubeScore = `${data.autoCubeScore}`
    autoScore = `${data.autoScore}`;
    teleConeHigh = `${data.teleConeHighScore}`;
    teleConeLow = `${data.teleConeLowScore}`;
    teleCube = `${data.teleCubeScore}`;
    teleBalance = `${data.teleBalance}`;
    teleScore = `${data.teleScore}`;

    db.insertMatchData(number, match, placement, mobility, autoBalance, coneHigh, coneLow, cubeScore, autoScore, teleBalance, teleConeHigh, teleConeLow, teleCube, teleScore);

    keep_alive = true;

    res.redirect('/match_scouting');
})

//Admin Page
app.get("/admin", function (req, res) {

   
        res.render("admin",
            {
                eventName: eventName,
                eventKey: eventKey
            });
})

//Posts Team List Table
app.get("/team_table", function (req, res) {
    db.conn.query('SELECT * FROM EventTeams', function (err, result) {
        if (err) {
            console.error(err);
        } else {
            res.render('team_table', { data: result });
        }
    });
})

//Posts Match Scouting Table
app.get("/match_table", function (req, res) {

    db.conn.query('SELECT * FROM match_info ORDER BY MatchNum ASC', function (err, result) {
        if (err) {
            console.error(err);
        } else {
            res.render('match_table', { data: result });
        }
    });
})

//Posts Pit Scouting Table
app.get("/pit_table", function (req, res) {

    db.conn.query('SELECT * FROM team_info', function (err, result) {
        if (err) {
            console.error(err);
        } else {
            res.render('pit_table', { data: result });
        }
    });

})


app.post("/admin", function (req, res, next) {
    var data = req.body;
    eventName = `${data.eventName}`;
    eventKey = `${data.eventCode}`;

    db.createNewEventDatabase(eventName);
    db.createAllTables();
    db.insertEventData(eventName, eventKey);
    tba.getTeamsByEvent(eventKey);

    res.redirect('/admin');
})

app.get('/restricted', restrict, function (req, res) {
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});


function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(null, null)
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash === user.hash) return fn(null, user)
        fn(null, null)
    });
}

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.post('/login', function (req, res, next) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (err) return next(err)
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function () {
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/admin">/restricted</a>.';
                res.redirect('back');
            });
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.'
                + ' (use "tj" and "foobar")';
            res.redirect('/login');
        }
    });
});


//404 Page Error
app.get("*", function (req, res) {
    res.send("404 Page Not Found!");
})


function pingdb() {
    var sql_keep = `SELECT 1 + 1 AS solution`;
    db.conn.query(sql_keep, function (err, result) {
        if (err) throw err;
        console.log("Ping DB");
    });
}
setInterval(pingdb, 3600000);

//Server Start
app.listen(httpPort, function () {
    console.log("Convergence Scouting Server Running on Port:" + httpPort);
})
