require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID
const { REST } = require('@discordjs/rest')
const TENORAPI_KEY = process.env.TENORAPI_KEY
modules.export = (term) => sendRequest(search_url, term)

function sendrequest(search_url, term) {
  const result = null
  REST.get(search_url)
    .then((response) => (result = response.results[0].media_formats.gif.url))
    .catch(console.error)
  return result
}

// set the apikey and limit

const apikey = TENORAPI_KEY
const clientkey = CLIENT_ID
const lmt = 1

// test search term
const search_term = term

// using default locale of en_US
const search_url =
  'https://tenor.googleapis.com/v2/search?q=' +
  search_term +
  '&key=' +
  apikey +
  '&client_key=' +
  clientkey +
  '&limit=' +
  lmt
