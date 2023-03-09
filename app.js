const express = require("express");
const app = express();
const httpPort = 8080;


app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/img"));
app.set("view engine", "ejs");


//Index Page
app.get("/", function(req, res){
    res.render("homepage");
})

//Pit Scouting Page
app.get("/pit_scouting", function(req, res){
    
    res.render("pit_scouting", {
     
    });
})

//Match Scout Page
app.get("/match_scouting", function(req, res){
    res.render("match_scouting");
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