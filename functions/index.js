const functions = require("firebase-functions");
const axios = require("axios");

exports.catalogScan = functions.https.onCall(data => {
  const hash = data.hash;

  return axios
    .get(`https://nook.lol/${hash}/json?locale=ja-jp`)
    .then(res => {
      return {
        status: 200,
        data: res.data
      };
    })
    .catch(error => {
      return {
        status: error.response.status,
        data: error.data
      };
    });
});
