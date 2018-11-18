console.log("=BOT STARTING=")

const Twitter = require('twitter');
 
const config = require('./config');

const Twit = new Twitter(config)
 
const tweet = {
  status: "hello world3"
}

Twit.post('statuses/update', tweet,  function(error, tweet, response) {
  if(error){
    console.log(error)
  }
  console.log("SUCCESS")
  // console.log(tweet);  // Tweet body.
  // console.log(response);  // Raw response object.
});


