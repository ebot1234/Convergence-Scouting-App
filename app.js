const express = require("express");
const request = require("request");
const tba = require("./tba");
const db = require("./my-sql");
var bodyParser = require('body-parser');

const app = express();
const httpPort = 3000;


//Functions to call by webpages
//db.createEventDatabase('Portsmouth');
//db.createAllTables();
//tba.getTeamsByEvent('2023vapor');
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
    weight = `${data.teamNumberInput}`;
    height = `${data.teamNumberInput}`;
    length = `${data.teamNumberInput}`;
    width = `${data.teamNumberInput}`;
    drivetrain = `${data.teamNumberInput}`;
    drivetrain_motors = `${data.teamNumberInput}`;
    free_speed = `${data.teamNumberInput}`;
    element_pickup = `${data.teamNumberInput}`;
    element_scoring = `${data.teamNumberInput}`;
    hang_charge_station = `${data.teamNumberInput}`;
    start_position = `${data.teamNumberInput}`;
    auto_balence = `${data.teamNumberInput}`;

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
    console.log(req.body);
    res.redirect('/match_scouting');
})

//Admin Page
app.get("/admin", function(req, res){
    res.render("admin", 
    {eventName : eventName,
        eventKey : eventKey
    });
})

var repeat = false;

app.post("/admin", function(req, res, next){
    var data = req.body;
    eventName = `${data.eventName}`;
    eventKey = `${data.eventCode}`;
    
    //db.createAllTables();
    //db.insertEventData(eventName, eventKey);
    //tba.getTeamsByEvent(eventKey);

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




//Server Start
app.listen(httpPort, function(){
    console.log("Convergence Scouting Server Running on Port:" + httpPort);
})
