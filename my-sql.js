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
    conn.query(`CREATE TABLE EventTeams (Number INT, Nickname VARCHAR(255), Rookie VARCHAR(255))`, function(err, result){
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
        Number Text,
        Weight Text,
        Height Text,
        Length Text,
        Width Text,
        Drivetrain Text,
        Drivetrain_Motors Text,
        FreeSpeed Text,
        Element_Pickup Text,
        Element_Scoring Text,
        Hang_Charge Text,
        Start_Position Text,
        Auto_Balence Text
    )`, function(err, result){
        if(err) {
            console.error(err);

        }else{
            console.log("created team info table");
        }
    });
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
        Auto_Balence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    conn.query(query, [number,weight,height,length,width,drivetrain,drivetrain_motors,free_speed,element_pickup,element_scoring, hang_charge_station,start_position,auto_balence]);
}


//Inserts teams into EventTeams Database
function insertTeam(team, nickname, rookie_year){
    team_sql = `INSERT INTO EventTeams(Number, Nickname, Rookie) VALUES (?,?,?)`;
    conn.query(team_sql, [team, nickname, rookie_year]);
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





module.exports = {insertTeamData, createNewEventDatabase, createEventTable, createEventTeamsTable, createTeamInfoTable, insertTeam, createAllTables, pullTeams, insertEventData, teams, conn};