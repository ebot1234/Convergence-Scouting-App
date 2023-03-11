const express = require("express");
const request = require("request");
const tba = require("./tba")
const db = require("./database");
var bodyParser = require('body-parser');

const app = express();
const httpPort = 3000;


//Functions to call be webpages
//db.createEventDatabase('Portsmouth');
//db.createAllTables();
//tba.getTeamsByEvent('2023vapor');


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

//Pit Scouting Page
app.get("/pit_scouting", function(req, res){
    res.render("pit_scouting");
})

app.post('/pit_scouting', function(req, res, next){
    console.log(req.body);
    res.redirect('/pit_scouting');
})

app.post('/', function(req, res, next) {
    console.log(req.body);
});

app.get('/bob', function(req, res){
    res.render("bob");
});

app.post('/bob', function(req, res, next){
    console.log(req.body);
    res.redirect('/bob');
})

//Match Scout Page
app.get("/match_scouting", function(req, res){
    res.render("match_scouting");
})

app.post('/match_scouting', function(req, res, next){
    console.log(req.body);
    res.redirect('/match_scouting');
})

//Admin Page
app.get("/admin", function(req, res){
    res.render("admin");
})


//404 Page Error
app.get("*", function(req, res){
    res.send("404 Page Not Found!");
})





app.listen(httpPort, function(){
    console.log("Convergence Scouting Server Running on Port:" + httpPort);
})