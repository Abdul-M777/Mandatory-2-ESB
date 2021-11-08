const { default: axios } = require('axios');
const express = require('express')
const app = express()
const xmlparser = require('express-xml-bodyparser');


app.use(
  express.urlencoded({
    extended: true
  })
)


app.use(express.json())



axios.post('http://localhost:8080/football', {
    id: "7",
    topic: "Harry",
    format: "xml",
}).then(function (response) {
  console.log(response.data)
}).catch(function (error) {
  console.log(error)
});

