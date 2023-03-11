const sqlite3 = require("sqlite3").verbose();
var fs = require("fs");
let sql;
let db;


//Create Table
sql = `CREATE TABLE Event (
    Event TEXT,
    Event_Key varchar(255),
    Teams INT,
)`
//db = new sqlite3.Database("./"+ event_name +".db", sqlite3.OPEN_READWRITE, (err) =>{
///    if (err) return console.error(err.message);
//});

//Creates a database for each event
function createEventDatabase(event_name){
        db = new sqlite3.Database("./"+ event_name +".db", sqlite3.OPEN_READWRITE, (err) =>{
            if (err && err.code == "SQLITE_CANTOPEN"){
                var newdb = new sqlite3.Database(event_name+'.db');
            }
        });
    console.log("created event database for:" + event_name);
}

function createEventTable(){
    event_sql = `CREATE TABLE Event (id INT PRIMARY KEY, Event TEXT, Event_Key varchar(255),Teams INT)`
    db.run(event_sql, (err)=>{
        console.error(err.message);
    });
}

function createTeamTable(){
    team_sql = `CREATE TABLE Team_Info (
        id INT PRIMARY KEY,
        Number INT,
        Weight INT,
        Height INT,
        Length INT,
        Width INT,
        Drivetrain TEXT,
        Drivetrain_Motors TEXT,
        FreeSpeed INT,
        Element_Pickup TEXT,
        Element_Scoring TEXT,
        Hang_Charge BOOL,
        Start_Position TEXT,
        Auto_Balence TEXT
    )`

    db.run(team_sql, (err)=>{
        console.error(err.message);
    });
}

function createEventTeamsTable(){
    team_sql = `CREATE TABLE EventTeams (
        id INT PRIMARY KEY,
        Number INT
        )`
    db.run(team_sql, (err)=>{
        console.error(err.message);
    });
}

//Creates all tables needed
function createAllTables(){
    createEventTable();
    createEventTeamsTable();
    createTeamTable();
    console.log("Hehe");
}

//Close Database
function closeDB(){
    db.close();
}

//Inserts teams into EventTeams Database
function insertTeams(team){
    team_sql = `INSERT INTO EventTeams(Number) VALUES (?)`;
    db.run(team_sql, team);
}

function insertTeamData(number,weight,height,length,width,drivetrain,drivetrain_motors,free_speed,element_pickup,element_scoring, hang_charge_station,start_position,auto_balence){
    query = `INSERT INTO Team_Info(Number,
        Weight,
        Height,
        Length,
        Width,
        Drivetrain,
        Drivetrain_Motors,
        FreeSpeed,
        Element_Pickup,
        Element_Scoring,
        Hang_Charge,
        Start_Position,
        Auto_Balence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`

    db.run(query, [number,weight,height,length,width,drivetrain,drivetrain_motors,free_speed,element_pickup,element_scoring, hang_charge_station,start_position,auto_balence]);
}


function pullTeams(){
    query = `SELECT * FROM EventTeams`;
    db.all(query, [], (err, rows)=>{
        rows.forEach(row =>{
            console.log(row);
        })
    });
}

function deleteTeams(){
    query = `DELETE FROM EventTeams`;
    db.run(query);
}

//Export functions and Variables
module.exports = { createAllTables, createTeamTable, createEventTable, createEventDatabase, createEventTeamsTable, insertTeams, pullTeams, deleteTeams, insertTeamData };