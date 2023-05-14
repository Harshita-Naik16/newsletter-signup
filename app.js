const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json());

app.get("/", (req, res) => {
   res.sendFile(__dirname + '/signup.html');
})

app.post("/", (req, res) => {
   //  console.log(req.body);
   const { email, fname, lname } = req.body;
   const addData = {
      members: [
         {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
               "FNAME": fname,
               "LNAME": lname
            }
         }
      ]
   }
   const addDataJson = JSON.stringify(addData);
   const options = {
      method: 'POST',
      auth: "hershey:2694de2c6f3cdf8e6b91c7626317ae82-us21"
   }
   const url = 'https://us21.api.mailchimp.com/3.0//lists/e6ff1cbbdc'

   const request = https.request(url, options, (response) => {
      if(response.statusCode === 200) {
         res.sendFile(__dirname + '/success.html');
      }else {
         res.sendFile(__dirname + '/failure.html');
      }


      response.on('data', (data) => {
         console.log(JSON.parse(data));
      })
   })
   
   

   request.write(addDataJson);
   request.end();
})

app.post('/failure', (req, res) => {
   res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => console.log("server listening on port 3000"))

