console.log("=BOT STARTING=")

const Twitter = require('twitter');

const config = require('./config');

const Twit = new Twitter(config)

var ajax = require("ajax-request")
var https = require("https");


// const tweet = {
//   status: "hello world3"
// }

// Twit.post('statuses/update', tweet,  function(error, tweet, response) {
//   if(error){
//     console.log(error)
//   }
//   console.log("TWEET SUCCESS")
//   // console.log(tweet);  // Tweet body.
//   // console.log(response);  // Raw response object.
// });  


const stock = "msft"

const options = {
  hostname: "api.iextrading.com",
  port: 443,
  path: "/1.0/stock/" + stock + "/price",
  method: "GET"
}

let price = ""




req = https.get(options, function (res) {
  res.on("data", function (data) {
    price += data;
  })
  res.on("end", function () {
    if (price === "108.29") {
      console.log("ALERT!")
      console.log(stock + ": $" + price)
    } else {
      console.log("alert not triggered")
    }
  })
})



// if (price === "4.93") {
//   console.log("ALERT!")
//   console.log(stock + ": $" + price)
// }


