const request = require("request");
const db = require("./database.js");

var tbaId = "jINO6qdzc4xGIZKGxGl6FzY1PzOT29IuOrm0jHoWH21ZHWS6OOjYXhOjl2PI8i2Y";
var baseURL = "https://www.thebluealliance.com/api/v3";
var data;

//Pulls teams and puts them in database
function getTeamsByEvent(eventID){
    queryString = baseURL + '/event/' + eventID + '/teams/simple';

    request.get( {url : queryString, headers : {"X-TBA-Auth-Key" : tbaId}}, function(error, response, body){
        if(error){
            console.log("Error getting team info from TBA");
        }else{
            //Parse returned body to JSON object
            data = JSON.parse(body);

            //loop through JSON object to get each team number
          for (team of data){
            console.log(`${team.team_number}`);
            db.insertTeams(`${team.team_number}`);
            console.log("Added Team " + `${team.team_number}` +" into Event Database");
          }
          
        }
        console.log(db.pullTeams());
        
    });
    
}

//Export functions and Variables
module.exports = { getTeamsByEvent, data };