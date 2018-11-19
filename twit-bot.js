console.log("=BOT STARTING=")

const Twitter = require('twitter');

const config = require('./config');

const Twit = new Twitter(config)

var ajax = require("ajax-request")
var https = require("https");

// ibm : 121.00
// sndx : 4.85
// rht : 174.50

const alertList = [
  ibm = {
    symbol: "ibm",
    target: "130", 
    current: 0,
    triggered: false
  },

  sndx = {
    symbol: "sndx",
    target: "4.85",  
    current: 0,
    triggered: false
  },

  rht = {
    symbol: "rht",
    target: "174.5",
    current: 0,
    triggered: false
  }

]



function getPricing() {
  // const alertList = ["ibm", "sndx", "rht"]


  for (let i = 0; i < alertList.length; i++) {
    const options = {
      hostname: "api.iextrading.com",
      port: 443,
      path: "/1.0/stock/" + alertList[i].symbol + "/price",
      // path: "/1.0/stock/market/crypto/",
      method: "GET"
    }

    let price = ""
    req = https.get(options, function (res) {
      res.on("data", function (data) {
        price += data;
        console.log(alertList[i].symbol + " $" + price)
        console.log(alertList[i].symbol + " $" + alertList[i].target + "- target price")
        console.log(alertList[i].symbol + " $" + alertList[i].current + "- current price")
        alertList[i].current = price

      })
      res.on("end", function () {

      })
    })
  }
  checkTargetPrice()

}


function checkTargetPrice() {
  for (let i = 0; i < alertList.length; i++) {
    if (alertList[i].target === alertList[i].current && alertList[i].triggered === false) {
      console.log("ALERT: TARGET PRICE REACHED");
      alertList[i].triggered = true;
      blastTweet(alertList[i]);
    }
    console.log("NOTHING TRIGGERED")
  }
}

function blastTweet(target){
const tweet = {
  status: "TARGET PRICE REACHED: " + target.symbol + " $" + target.current
}

Twit.post('statuses/update', tweet,  function(error, tweet, response) {
  if(error){
    console.log(error)
  }
  console.log("TWEET SUCCESS")
  // console.log(tweet);  // Tweet body.
  // console.log(response);  // Raw response object.
});  
}


setInterval(function () {
  console.log("GETTING PRICE")
  getPricing()

}, 1000 * 60)








// https://api.iextrading.com/1.0/stock/market/crypto/


// const stock = "msft"

// const options = {
//   hostname: "api.iextrading.com",
//   port: 443,
//   // path: "/1.0/stock/" + stock + "/price",
//   path: "/1.0/stock/market/crypto/",
//   method: "GET"
// }

// let body = ""




// req = https.get(options, function (res) {
//   res.on("data", function (data) {
//     body += data;
//     // let parsed = JSON.parse(body);
//     console.log("data: ")
//     console.log(body)
//   })
//   res.on("end", function () {

//   })
// })



// if (price === "4.93") {
//   console.log("ALERT!")
//   console.log(stock + ": $" + price)
// }



// if (price === "108.29") {
//   console.log("ALERT!")
//   console.log(stock + ": $" + price)
// } else {
//   console.log("alert not triggered")
// }
