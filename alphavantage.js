// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=N06BDYLYWYZK0MA6

var https = require("https");

const options = {
  hostname: "www.alphavantage.co",
  port: 443,
  path: "/query?function=TIME_SERIES_INTRADAY&symbol=MSFT-SNDX&interval=5min&apikey=N06BDYLYWYZK0MA6",
  method: "GET"
}

let tempData = ""
req = https.get(options, function (res) {
  res.on("data", function (data) {
    tempData += data;
    // tempData = JSON.parse(tempData)
    console.log(tempData)
  })

  res.on("end", function () {


  })
});