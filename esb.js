const express = require('express')
const app = express()
const xmlparser = require('express-xml-bodyparser');
const axios = require('axios');
const CSVconverter = require("json-2-csv");
const csv = require('csvtojson');
const convert = require("xml-js");
const { tsv2json, json2tsv } = require('tsv-json');


let fs = require('fs');
const { send } = require('process');
const { stringify } = require('querystring');
const { message } = require('prompt');

app.use(
  express.urlencoded({
    extended: true
  })
)


app.use(xmlparser());
app.use(express.json())

app.post('/todos', xmlparser({trim: false, explicitArray: false}), async (req, res) => {
    let message = {topic: req.body.message.topic[0], data: req.body.message.data[0]}

  console.log(req.body)

  data = JSON.stringify(message);

  fs.appendFile('mynewfile1.txt', "\n" + data, function (err) {
      if (err) throw err;
      console.log("Saved");
      res.sendStatus(200);
  });

});

app.post('/football', function (req, res) {
   const request = req.body.topic

   const message = req.body;

   console.log("Message: " + message);

   console.log("Request: " +request);

   const requestFormat = req.body.format;

   console.log("RequestFormat: "+requestFormat);

   fs.readFile('mynewfile1.txt', function (err, data) {
     if (err) throw err;
     const dataArray = [];

     const user = data.toString().replace(/\r\n/g, "\n").split("\n");

     for (const key in user) {
       
        dataArray.push(JSON.parse(user[key]));
     }
     sendArray = [];
     for (const key in dataArray) {
       if (dataArray[key].topic == request) {
         sendArray.push(dataArray[key]);
       }
     }

     if(sendArray.length === 0) {
       res.send("Topic not found");
     } else if (requestFormat == "csv") {
       CSVconverter.json2csv(sendArray, (err, csv) => {
         if (err) {
           throw err;
         }

         res.send(csv);
       });
     } else if (requestFormat == "json") {
       res.send(sendArray);
     } else if (requestFormat == "xml"){
       const options = {compact: true, ignoreComment: true, spaces: 4};
       const xml = convert.json2xml(sendArray, options);

       res.send(xml);

       
     } else if (requestFormat == "tsv") {

      CSVconverter.json2csv(sendArray, (err, csv) => {
        if (err) {
          throw err;
        }
        tsv = csv.replace(/,/g, "\t")
        res.send(tsv);

        
        

        for (let i = 0; i < sendArray.length; i++) {
          id = req.body.id[0]
          if ('id' in sendArray[i] === false) {
            sendArray[i].id = id;
            console.log(sendArray[i])
          }
          dub_data = JSON.stringify(sendArray[i])
          console.log(dub_data)
          fs.readFile('mynewfile2.txt', function (err, data) {
            if (err) throw err;
            if(data.includes(dub_data)){
             console.log("Not saved in dublicate")
             console.log(data.toString().length)
            } else {
              fs.appendFile('mynewfile2.txt', dub_data + "\n", function (err) {
                if (err) throw err;

                
                
                console.log("Saved dublicate");
            });
            }
            
          });

          
          
        }
        
        
        

      
    });
  }
     else {
       res.send("Please send correct format");
     }
   });

   console.log("Message queue sent to client 2")

});

app.listen(8080, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 8080");
        console.log("ESB is configured...");
    }
});