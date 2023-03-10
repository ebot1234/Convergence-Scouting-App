const request = require("request");
const https = require("https");

var tbaId = "jINO6qdzc4xGIZKGxGl6FzY1PzOT29IuOrm0jHoWH21ZHWS6OOjYXhOjl2PI8i2Y";
var baseURL = "https://www.thebluealliance.com/api/v3";




function getTeamsByEvent(eventCode){
    https.get(queryString = baseURL + '/event/' + eventCode + '/simple', res => {
        let data = [];
        //const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log('Status Code:', res.statusCode);
        //console.log('Date in Response header:', headerDate);
      
        res.on('data', chunk => {
          data.push(chunk);
        });
      
        res.on('end', () => {
          console.log('Response ended: ');
          const users = JSON.parse(Buffer.concat(data).toString());
      
          for(user of users) {
            console.log(`Got user with id: ${user.id}, name: ${user.name}`);
          }
        });
      }).on('error', err => {
        console.log('Error: ', err.message);
      });
}

function testAPI(eventID){
    queryString = baseURL + '/event/' + eventID + '/teams/simple';
    
    var data;

    request.get( {url : queryString, headers : {"X-TBA-Auth-Key" : tbaId}}, function(error, response, body){
        if(error){
            console.log("Error getting team info from TBA");
        }else{
            
            data = JSON.parse(body);
            //console.log(data[0].team_number);

           for (team of data){
            console.log(`${team.team_number}`)
           }
            
        }
    });

    return data;
}

//Export functions and Variables
module.exports = { testAPI, getTeamsByEvent };