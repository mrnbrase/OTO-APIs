// Step 1: Import fetch (only needed in Node.js environment)
// const fetch = require('node-fetch');

// Define headers for the refreshToken request
var refreshHeaders = new Headers();
refreshHeaders.append("Content-Type", "application/json");

// Define body for the refreshToken request
var refreshRaw = JSON.stringify({
  "refresh_token": "AMf-vBxyYfrcy9ZMzic7ZsYn1rYPKTh2h5cMq4Zn8o2XDjfcGrp-oNQNg-Cza7dHNk0yPMjNTDnWlE_xtQdojVdOzgNO5CarK6uB5TLECWBEj0FRKYCmcn-cFd5g_jcR6zLsz2v0pXlaSuNFv6MBjBuCkHvZ49hTmsdNZvOdiDzQJWbTJd4SoarLrJC_KqiJqBDpDE-uZTyChELAtJvj5qn4sKxbek00hA"

});

// Define request options for the refreshToken request
var refreshRequestOptions = {
  method: 'POST',
  headers: refreshHeaders,
  body: refreshRaw,
  redirect: 'follow'
};

// Make the refreshToken request
fetch("https://api.tryoto.com/rest/v2/refreshToken", refreshRequestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result);
    var jwt = result.access_token;

    // Define headers for the checkOTODeliveryFee request
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + jwt);

    // Define body for the checkOTODeliveryFee request
    var raw = JSON.stringify({
      "weight": "3",
      "originCity": "Riyadh",
      "destinationCity": "Jeddah",
      "height": 30,
      "width": 30,
      "length": 30
    });

    // Define request options for the checkOTODeliveryFee request
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    // Make the checkOTODeliveryFee request
    return fetch("https://api.tryoto.com/rest/v2/checkOTODeliveryFee", requestOptions);
  })
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));