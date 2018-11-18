console.log("=BOT STARTING=")

var Twitter = require('twitter');
 
var config = require('./config');
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});

console.log(config)