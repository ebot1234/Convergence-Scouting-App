const express = require("express");
const request = require("request");
const tba = require("./tba");
const db = require("./my-sql");
var bodyParser = require('body-parser');

const app = express();
const httpPort = 3000;

let keep_alive = false;


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

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");


//Index Page
app.get("/", function(req, res){
    res.render("homepage");
})

//Pit Scouting GET
app.get("/pit_scouting", function(req, res){
    res.render("pit_scouting");
})

//Pit Scouting POST
app.post('/pit_scouting', function(req, res, next){
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
    db.insertTeamData(number,weight,height,length,width,drivetrain,drivetrain_motors,free_speed,element_pickup,element_scoring, hang_charge_station,start_position,auto_balence);

    res.redirect('/pit_scouting');
})

app.post('/', function(req, res, next) {
    console.log(req.body);
});


//Match Scout GET
app.get("/match_scouting", function(req, res){
    res.render("match_scouting");
})

//Match Scout POST
app.post('/match_scouting', function(req, res, next){
    var data = req.body;
    console.log(data);

    number = `${data.teamNumberInput}`;
    match = `${data.matchNumberInput}`;
    placement = `${data.autoPlacement}`;
    mobility = `${data.autoMobility}`;
    autoBalance = `${data.autoBalance}`;
    coneHigh = `${data.autoConeHighScore}`;
    coneLow = `${data.autoConeLowScore}`;
    cubeScore = `${data.autoCubeScore}`;
    teleConeHigh = `${data.teleConeHighScore}`;
    teleConeLow = `${data.teleConeLowScore}`;
    teleCube = `${data.teleCubeScore}`;
    teleBalance = `${data.teleBalance}`;

    db.insertMatchData(number,match,placement,mobility,autoBalance,coneHigh,coneLow,cubeScore,teleBalance,teleConeHigh,teleConeLow,teleCube);

    keep_alive = true;

    res.redirect('/match_scouting');
})

//Admin Page
app.get("/admin", function(req, res){
    res.render("admin", 
    {eventName : eventName,
        eventKey : eventKey
    });
})

//Posts Team List Table
app.get("/team_table", function(req, res){
    db.conn.query('SELECT * FROM EventTeams', function (err, result){
        if (err){
            console.error(err);
        }else{
            res.render('team_table', {data : result});
        }
    });
})

//Posts Match Scouting Table
app.get("/match_table", function(req, res){

    db.conn.query('SELECT * FROM match_info ORDER BY MatchNum ASC', function (err, result){
        if (err){
            console.error(err);
        }else{
            res.render('match_table', {data : result});
        }
    });
})

//Posts Pit Scouting Table
app.get("/pit_table", function(req, res){

    db.conn.query('SELECT * FROM team_info', function (err, result){
        if (err){
            console.error(err);
        }else{
            res.render('pit_table', {data : result});
        }
    });

})


app.post("/admin", function(req, res, next){
    var data = req.body;
    eventName = `${data.eventName}`;
    eventKey = `${data.eventCode}`;

    db.createNewEventDatabase(eventName);
    db.createAllTables();
    db.insertEventData(eventName, eventKey);
    tba.getTeamsByEvent(eventKey);

    res.redirect('/admin');
})

//404 Page Error
app.get("*", function(req, res){
    res.send("404 Page Not Found!");
})


function pingdb() {
    var sql_keep = `SELECT 1 + 1 AS solution`; 
    db.conn.query(sql_keep, function (err, result) {
      if (err) throw err;
      console.log("Ping DB");
    });
  }
  setInterval(pingdb, 600000);

//Server Start
app.listen(httpPort, function(){
    console.log("Convergence Scouting Server Running on Port:" + httpPort);
})
