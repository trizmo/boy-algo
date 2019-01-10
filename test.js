console.log("test OK")




var alertList = require("./alertList.js")
// console.log(alertList)

for(let key in alertList){
  console.log(alertList[key].symbol)
}