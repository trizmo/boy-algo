console.log("=BOT STARTING=")
console.log("@BoyAlgo - a Twitter bot that alerts you when your stock and coin price reach a target number")
console.log("=============================================================================================")
console.log("=============================================================================================")
console.log("=============================================================================================")

let ready = false;

let priceFetchCounter = 0;

const Twitter = require('twitter');

const config = require('./config');

const Twit = new Twitter(config)

var ajax = require("ajax-request")
var https = require("https");

ibm: 121.00
sndx: 4.85
rht: 174.50

const alertList = [
  ibm = {
    symbol: "IBM",
    targetUP: ["119.30"],
    targetDN: ["117.18"],
    current: 0,
    type: "stock",
    triggered: false
  },

  sndx = {
    symbol: "SNDX",
    targetUP: ["5.20"],
    targetDN: ["4.950"],
    current: 0,
    type: "stock",
    triggered: true
  },

  rht = {
    symbol: "RHT",
    targetUP: ["173.45"],
    targetDN: ["172.50"],
    current: 0,
    type: "stock",
    triggered: false
  },

  xrp = {
    symbol: "XRP",
    targetUP: [0.51],
    targetDN: [0.40],
    current: 0,
    type: "crypto",
    triggered: false
  },

  btc = {
    symbol: "BTC",
    targetUP: [4600],
    targetDN: [4550],
    current: 0,
    type: "crypto",
    triggered: false
  },

  ltc = {
    symbol: "LTC",
    targetUP: [34],
    targetDN: [33.00],
    current: 0,
    type: "crypto",
    triggered: false
  },

  TRX = {
    symbol: "TRX",
    targetUP: [0.015],
    targetDN: [0.013],
    current: 0,
    type: "crypto",
    triggered: false
  }


]

function everythingLog() {
  console.log(alertList)
}

function initializePriceing() {
  console.log("STARTING SERVER")
  console.log("initializing price")
  for (let i = 0; i < alertList.length; i++) {
    if (alertList[i].type === "stock") {

      const options = {
        hostname: "api.iextrading.com",
        port: 443,
        path: "/1.0/stock/" + alertList[i].symbol + "/price",
        method: "GET"
      }

      let price = ""
      req = https.get(options, function (res) {
        res.on("data", function (data) {
          priceFetchCounter++
          price += data;
          alertList[i].current = price

        })
        res.on("end", function () {

        })
      })
    } else if (alertList[i].type === "crypto") {
      let coinSym = alertList[i].symbol


      // let coinlist = [];
      // let coinlistST = coinlist.join(",")
      // console.log("coinlist to be sent: " + coinlistST)

      // for (i = 0; i < alertList.length; i++) {
      //   console.log(alertList[i].symbol);
      //   coinlist.push(alertList[i].symbol);
      // }

      const options = {
        hostname: "min-api.cryptocompare.com",
        port: 443,
        path: "/data/pricemulti?fsyms=" + alertList[i].symbol + "&tsyms=USD",
        method: "GET"
      }

      let cryptoPrice;
      let stringed = "";
      let toparse = ""
      let finalArray = [];
      req = https.get(options, function (res) {
        res.on("data", function (data) {
          toparse += data;
          console.log(toparse)
          cryptoPrice = JSON.parse(toparse);
          // console.log("coin price data...:");
          // console.log(cryptoPrice[coinSym].USD);
          // console.log(typeof (cryptoPrice[coinSym].USD))
          stringed = JSON.stringify(cryptoPrice[coinSym].USD)
          // console.log(alertList[i])
          alertList[i].current = cryptoPrice[coinSym].USD

        })
      })
    }
  }
  everythingLog()

}


function getPricing() {

  let masterArray = [];

  for (let i = 0; i < alertList.length; i++) {
    if (alertList[i].type === "stock") {

      const options = {
        hostname: "api.iextrading.com",
        port: 443,
        path: "/1.0/stock/" + alertList[i].symbol + "/price",
        method: "GET"
      }

      let price = ""
      req = https.get(options, function (res) {
        res.on("data", function (data) {
          priceFetchCounter++
          price += data;
          alertList[i].current = price

        })
        res.on("end", function () {

        })
      })
    } else if (alertList[i].type === "crypto") {
      let coinSym = alertList[i].symbol


      // let coinlist = [];
      // let coinlistST = coinlist.join(",")
      // console.log("coinlist to be sent: " + coinlistST)

      // for (i = 0; i < alertList.length; i++) {
      //   console.log(alertList[i].symbol);
      //   coinlist.push(alertList[i].symbol);
      // }

      const options = {
        hostname: "min-api.cryptocompare.com",
        port: 443,
        path: "/data/pricemulti?fsyms=" + alertList[i].symbol + "&tsyms=USD",
        method: "GET"
      }

      let cryptoPrice;
      let stringed = "";
      let toparse = ""
      let finalArray = [];
      req = https.get(options, function (res) {
        res.on("data", function (data) {
          toparse += data;
          console.log(toparse)
          cryptoPrice = JSON.parse(toparse);
          // console.log("coin price data...:");
          // console.log(cryptoPrice[coinSym].USD);
          // console.log(typeof (cryptoPrice[coinSym].USD))
          stringed = JSON.stringify(cryptoPrice[coinSym].USD)
          // console.log(alertList[i])
          alertList[i].current = cryptoPrice[coinSym].USD

        })
      })
    }
  }

  for (i = 0; i < alertList.length; i++) {
    if (alertList[i].current !== 0) {
      ready = true
    } else {
      ready = false
    }
  }
  if (ready === true) {
    checkTargetPrice()
  }
}





function checkTargetPrice() {
  for (let i = 0; i < alertList.length; i++) {

    for (let j = 0; j < alertList[i].targetUP.length; j++) {
      if (alertList[i].targetUP[j] <= alertList[i].current && alertList[i].triggered === false) {
        console.log("ALERT: TARGETup PRICE REACHED FOR: " + alertList[i].symbol);
        alertList[i].triggered = true;
        blastTweet(alertList[i]);

        // console.log("NOTHING TRIGGERED")
      }
    }
    for (let j = 0; j < alertList[i].targetDN.length; j++) {
      if (alertList[i].targetDN[j] >= alertList[i].current && alertList[i].triggered === false) {
        console.log("ALERT: TARGETdn PRICE REACHED FOR: " + alertList[i].symbol);
        alertList[i].triggered = true;
        blastTweet(alertList[i]);
      }

    }






  }
  console.log(".")
  everythingLog()
}


function blastTweet(target) {
  console.log("ini tweet")
  const tweet = {
    status: "TARGET PRICE REACHED: " + target.symbol + " $" + target.current
  }

  Twit.post('statuses/update', tweet, function (error, tweet, response) {
    if (error) {
      console.log(error)
    }
    console.log("TWEET SUCCESS")
    // console.log(tweet);  // Tweet body.
    // console.log(response);  // Raw response object.
  });
}

initializePriceing()

setInterval(function () {
  console.log("GETTING PRICE: " + alertList.length);
  console.log("Fetch Counter: " + priceFetchCounter)
  getPricing();

}, 1000 * 60)