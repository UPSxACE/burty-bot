require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const TENORAPI_KEY = process.env.TENORAPI_KEY;
const axios = require('axios');
module.exports = async (term) => await findGif(term);

async function sendRequest(search_url) {
  let result = null;

  await axios
    .get(search_url)
    .then((response) => {
      result =
        response.data.results[Math.floor(Math.random() * 25)].media_formats.gif
          .url;
    })
    .catch((error) => {
      // handle error
      console.log(error);
    })
    .then(() => {
      // always executed
    });

  return result;
}

async function findGif(term) {
  // set the apikey and limit

  const apikey = TENORAPI_KEY;
  const clientkey = CLIENT_ID;
  const lmt = 25;

  // test search term
  const search_term = term;

  // using default locale of en_US
  const search_url =
    'https://tenor.googleapis.com/v2/search?q=' +
    search_term +
    '&key=' +
    apikey +
    '&client_key=' +
    clientkey +
    '&limit=' +
    lmt;

  return await sendRequest(search_url);
}
