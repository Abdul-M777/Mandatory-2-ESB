const express = require('express')
const app = express()
const xmlparser = require('express-xml-bodyparser');
const axios = require('axios');
const CSVconverter = require("json-2-csv");
const csv = require('csvtojson');
const convert = require("xml-js");
const { tsv2json, json2tsv } = require('tsv-json');


let fs = require('fs');
let fsp = require('fs').promises;
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
   const id = req.body.id;

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
     remainArray = [];
     for (const key in dataArray) {
       if (dataArray[key].topic == request) {
         sendArray.push(dataArray[key]);

       } else if (dataArray[key].topic != request){
          remainArray.push(dataArray[key]);
       } 
     }
     console.log("RemainArray: %j", remainArray);
     console.log("SendArray: " + JSON.stringify(sendArray));
     
     let harry = [];
     
     for (let index = 0; index < remainArray.length; index++) {
      harry.push(JSON.stringify(remainArray[index]));
       
     }
     console.log(harry)
     harry = harry.toString().replace(/,{/g, "\n{")
     console.log(harry);


       
     


     if(sendArray.length === 0) {

      fs.readFile('mynewfile2.txt', function (err, data2) {
        if (err) throw err;
        const dataArray2 = [];
   
        const user2 = data2.toString().replace(/\r\n/g, "\n").split("\n");
   
        for (const key in user2) {
          
           dataArray2.push(JSON.parse(user2[key]));
        }
        sendArray2 = [];
        console.log("REquest 2: " + request);
        for (const key in dataArray2) {
          if (dataArray2[key].topic == request) {
            sendArray2.push(dataArray2[key]);
   
          }
        }
        

        if(sendArray2.length === 0) {
          res.send("Topic not found");

        } else if (sendArray.length === 0 && sendArray2.length === 0){
          res.send("Topic not found");
  
        } else if (requestFormat == "json") {
          console.log(sendArray2[0].id);
          console.log(id)
          sendJson = [];
          for (let index = 0; index < sendArray2.length; index++) {
            if(!sendArray2[index].id.includes(id)) {
              sendJson.push(sendArray2[index]);
              console.log(sendArray2[index].id += id)
              console.log(sendArray2[index])
              fs.appendFile('mynewfile2.txt', "\n" + JSON.stringify(sendArray2[index]), function (err) {
                if (err) throw err;
              });
            }
          }
          if(sendJson.length === 0){
            res.send("Topic not found");
          } else {
          res.send(sendJson);
          }
      } else if (requestFormat == "csv") {
         
          sendCsv = [];
          for (let index = 0; index < sendArray2.length; index++) {
            if(!sendArray2[index].id.includes(id)) {
              sendCsv.push(sendArray2[index]);
              sendArray2[index].id += id
              console.log(sendArray2[index])
              fs.appendFile('mynewfile2.txt', "\n" + JSON.stringify(sendArray2[index]), function (err) {
                if (err) throw err;
              });
            }
          }
          if(sendCsv.length === 0){
            res.send("Topic not found");
          } else {
            CSVconverter.json2csv(sendCsv, (err, csv) => {
              if (err) {
                throw err;
              }
          res.send(csv);
        });
          }

      } else if (requestFormat == "tsv") {

          sendTsv = [];
          for (let index = 0; index < sendArray2.length; index++) {
            if(!sendArray2[index].id.includes(id)) {
              sendTsv.push(sendArray2[index]);
              sendArray2[index].id += id
              console.log(sendArray2[index])
              fs.appendFile('mynewfile2.txt', "\n" + JSON.stringify(sendArray2[index]), function (err) {
                if (err) throw err;
              });
            }
          }
          if(sendTsv.length === 0){
            res.send("Topic not found");
          } else {
            CSVconverter.json2csv(sendTsv, (err, csv) => {
              if (err) {
                throw err;
              }
              tsv = csv.replace(/,/g, "\t")
              res.send(tsv);
        });
          }

      } else if (requestFormat == "xml") {
        sendXml = [];
          for (let index = 0; index < sendArray2.length; index++) {
            if(!sendArray2[index].id.includes(id)) {
              sendXml.push(sendArray2[index]);
              sendArray2[index].id += id
              console.log(sendArray2[index])
              fs.appendFile('mynewfile2.txt', "\n" + JSON.stringify(sendArray2[index]), function (err) {
                if (err) throw err;
              });
            }
          }
          if(sendXml.length === 0){
            res.send("Topic not found");
          } else {
            const options = {compact: true, ignoreComment: true, spaces: 4};
            const xml = convert.json2xml(sendXml, options);

            res.send(xml);
        }
      }
        
      });

      
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

        async function main() {
        for (let i = 0; i < sendArray.length; i++) {
          id = req.body.id[0]
          if ('id' in sendArray[i] === false) {
            sendArray[i].id = id;
            console.log(sendArray[i])
          }
          dub_data = JSON.stringify(sendArray[i]);
          console.log("Dub_DATA: "+dub_data)
          const jsonArray = await fsp.readFile('mynewfile2.txt', function (err, data) {
            if (err) throw err;
          });
          console.log(jsonArray.toString())
            if(jsonArray.toString().includes(dub_data)){
             console.log("Not saved in dublicate")

            } else {
              
              console.log("Dub_DATA: "+dub_data)
              fs.appendFile('mynewfile2.txt', dub_data + "\n", function (err) {
                if (err) throw err;
                
              fs.writeFile("mynewfile1.txt", harry, function (err){
                  if (err) return console.log(err);
                  console.log('Saved');
                
                 });

                
                
                console.log("Saved dublicate");
            });
            }
            

          
          
        }
}
main();

      
      
      
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