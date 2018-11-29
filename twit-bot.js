console.log("=BOT STARTING=")
console.log("@BoyAlgo - Algorithmic Trading Bot")
console.log("==============================================")

var alertList = require("./alertList.js");
let ready = false;
let priceFetchCounter = 0;
const Twitter = require('twitter');
const config = require('./config');
const Twit = new Twitter(config);
var ajax = require("ajax-request");
var https = require("https");
var firebase = require("firebase");
var allSymbols;
var ALLDATA = {};
var alldataCounter = 0;

// ### FIREBASE CONFIGs
var FBconfig = {
  apiKey: "AIzaSyAlCXQUsNZnHq0ViG6KYg7yNz9a34OuHfE",
  authDomain: "market-system-a6b28.firebaseapp.com",
  databaseURL: "https://market-system-a6b28.firebaseio.com",
  projectId: "market-system-a6b28",
  storageBucket: "market-system-a6b28.appspot.com",
  messagingSenderId: "609139349737"
};

firebase.initializeApp(FBconfig);
var database = firebase.database();

// database.ref().on("value", function (snapshot) {
//   console.log("Firebase Snapshot: ")
//   let newList = snapshot.val()
//   // console.log(newList.alertList)
//   alertList = newList.alertList
//   console.log(alertList)
// });

// ## TO RESTART DB
// updateFirebase()


function updateFirebase() {
  database.ref("alertList").set({
    alertList
  })
}

function updateAllSymbols() {
  console.log("running updateAllSymbols")
  database.ref("all-symbols-ONLY").on("value", function (snapshot) {
    console.log("Firebase Snapshot OK")
    allSymbols = snapshot.val()
    console.log("update complete")
    console.log("===============")
    // console.log("Example symbol: ")
    // console.log(allSymbols[Object.keys(allSymbols)[0]  ] )
    collectKeyStats()
  })
}

// const index = 0
// const end = 100

// every second function collectKeyStats() { } will run
// once function is done running, i = end, end += 200.
// if end >= 8000. exit

// function checkNIncrease(index, end) {
//   if (end >= 8000) {
//     console.log("EXITING")
//     process.exit(1);
//   } else {
//     index = end
//     end += 50
//   }
// }

// setInterval(function () {
//   collectKeyStats(index, end)
//   checkNIncrease(index, end)

// }, 1000 * 5)


// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=N06BDYLYWYZK0MA6

function collectKeyStats() {
  console.log("running collectKeyStats")


  for (let key in allSymbols) {

    for (let i = 0; i < 3500; i++) {

      const options = {
        hostname: "api.iextrading.com",
        port: 443,
        path: "/1.0/stock/" + allSymbols[key].allSymbolsONLY[i] + "/stats",
        method: "GET"
      }

      let tempData = []
      req = https.get(options, function (res) {
        res.on("data", function (data) {
          alldataCounter++
          tempData += data;
          tempData = JSON.parse(tempData)
          console.log("calls for ALLDATA " + alldataCounter)


        })

        res.on("end", function () {
          // JSON.parse(Buffer.concat(tempData).toString())
          // onSuccess({
          //   status: res.statusCode,
          //   headers: res.headers,
          //   json: JSON.parse(Buffer.concat(tempData).toString())
          // })



          ALLDATA = tempData

          // console.log(ALLDATA["companyName"])
          // console.log("push to ALLDATA")
          var stockInfo = {
            symbol: ALLDATA["symbol"],
            day200MovingAvg: ALLDATA["day200MovingAvg"],
            day50MovingAvg: ALLDATA["day50MovingAvg"],
            companyName: ALLDATA["companyName"],
          }
          console.log(stockInfo)

          database.ref("ALLDATA").push({
            stockInfo
          })

        })

      })

    }

  }
  // console.log("EXITING")
  // process.exit(1);
}



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
  updateFirebase()
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
          if (toparse.substring(0, 1) === "<") {
            console.log("ERROR TRIGGER: " + toparse.substring(0, 1))
            errorTweet()
          } else {
            // console.log("DATA GOOD: " + toparse.substring(0,1))

            cryptoPrice = JSON.parse(toparse);
            // console.log("coin price data...:");
            // console.log(cryptoPrice[coinSym].USD);
            // console.log(typeof (cryptoPrice[coinSym].USD))
            stringed = JSON.stringify(cryptoPrice[coinSym].USD)
            // console.log(alertList[i])
            alertList[i].current = cryptoPrice[coinSym].USD
          }




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





// function checkTargetPrice() {
//   for (let i = 0; i < alertList.length; i++) {
//     if (alertList[i].current === 0) {
//       initializePriceing()
//     }

//     for (let j = 0; j < alertList[i].targetUP.length; j++) {
//       if (alertList[i].targetUP[j] <= alertList[i].current && alertList[i].triggered === false) {
//         console.log("ALERT: TARGETup PRICE REACHED FOR: " + alertList[i].symbol);
//         // alertList[i].triggered = true;
//         alertList[i].targetUP.splice(j, 1, 0)
//         // console.log("REMOVING: " + alertList[i].targetUP[j])
//         blastTweet(alertList[i]);

//         // console.log("NOTHING TRIGGERED")
//       }
//     }
//     for (let j = 0; j < alertList[i].targetDN.length; j++) {
//       if (alertList[i].targetDN[j] >= alertList[i].current && alertList[i].triggered === false) {
//         console.log("ALERT: TARGETdn PRICE REACHED FOR: " + alertList[i].symbol);
//         // alertList[i].triggered = true;
//         alertList[i].targetDN.splice(j, 1, 0)
//         // console.log("REMOVING: " + alertList[i].targetDN[j])


//         blastTweet(alertList[i]);
//       }

//     }






//   }
//   console.log(".")
//   everythingLog()
// }

// function errorTweet() {
//   console.log("ini tweet")
//   const tweet = {
//     status: "ERROR RECEIVED: SERVER STILL RUNNING"
//   }

//   Twit.post('statuses/update', tweet, function (error, tweet, response) {
//     if (error) {
//       console.log(error)
//     }
//     console.log("ERROR TWEET SUCCESS")
//     console.log(tweet);  // Tweet body.
//     console.log(response);  // Raw response object.
//   });
// }





// function blastTweet(target) {
//   console.log("ini tweet")
  // const tweet = {
  //   status: "TARGET PRICE REACHED: " + target.symbol + " $" + target.current
  // }

  // Twit.post('statuses/update', tweet, function (error, tweet, response) {
  //   if (error) {
  //     console.log(error)
  //   }
  //   console.log("TWEET SUCCESS")
  //   // console.log(tweet);  // Tweet body.
  //   // console.log(response);  // Raw response object.
  // });
// }

updateAllSymbols()
// collectKeyStats()
// initializePriceing()

// setInterval(function () {
//   console.log("GETTING PRICE: " + alertList.length);
//   console.log("Fetch Counter: " + priceFetchCounter)
//   getPricing();

// }, 1000 * 5)