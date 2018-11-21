const alertList = [
  ibm = {
    symbol: "ibm",
    targetUP: ["119.30"],
    targetDN: ["117.18"],
    current: 0,
    type: "stock",
    triggered: false
    },

  sndx = {
    symbol: "sndx",
    targetUP: ["4.90"],
    targetDN: ["4.70"],
    current: 0,
    type: "stock",
    triggered: false
  },

  rht = {
    symbol: "rht",
    targetUP: ["173.5"],
    targetDN: ["173.41"],
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
  }

]
https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR


c6abd50430ab2c2dcfd7fbb85b39455a227ba74527964ae83fc87de03694a0c0


$.ajax({
  url: https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,
  method: "GET"
}).then(function (response) {
  console.log(response);

});