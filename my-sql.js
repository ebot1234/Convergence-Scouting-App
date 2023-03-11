const { data } = require('jquery');
const mysql = require('mysql2');
const util = require('util');

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "convergence",
});

let teams;

//Creates Event Table
function createEventTable(){
    conn.query(`CREATE TABLE Event (Event TEXT, Event_Key varchar(255))`, function(err, result){
        if(err) {
            console.error(err);

        }else{
            console.log("created event table");
        }
    });
}


function createNewEventDatabase(eventName){
    createDatabase(eventName);
    conn.changeUser({database: `${eventName}`}, function(err){
        if (err){
            console.error(err);
        }
    });
}

function createDatabase(eventName){
    conn.query(`CREATE DATABASE ${eventName}`, function(err){
        if (err) {
            console.error(err);
        }
    });
}

//Creates EventTeams Table
function createEventTeamsTable(){
    conn.query(`CREATE TABLE EventTeams (Number INT)`, function(err, result){
        if(err) {
            console.error(err);

        }else{
            console.log("created event teams");
        }
    });
}

//Create TeamInfo Table
function createTeamInfoTable(){
    conn.query(`CREATE TABLE Team_Info (
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
    )`, function(err, result){
        if(err) {
            console.error(err);

        }else{
            console.log("created team info table");
        }
    });
}

//Inserts teams into EventTeams Database
function insertTeam(team){
    team_sql = `INSERT INTO EventTeams(Number) VALUES (?)`;
    conn.query(team_sql, team);
}

function insertEventData(code, key){
    sql = `INSERT INTO Event (Event, Event_Key) VALUES (?,?)`;
    conn.query(sql, [code, key]);
}

//Creates all tables
function createAllTables(){
    createEventTable();
    createEventTeamsTable();
    createTeamInfoTable();
}


//Logs all teams in EventTeams table
function pullTeams(){
    team_query = `SELECT * FROM EventTeams`;
    conn.query(team_query, function(err, result, fields){
        if(err){
            console.error(err);
        }else{
            teams=result;
            //console.log(teams);
        }
    })
}





module.exports = {createNewEventDatabase, createEventTable, createEventTeamsTable, createTeamInfoTable, insertTeam, createAllTables, pullTeams, insertEventData, teams};