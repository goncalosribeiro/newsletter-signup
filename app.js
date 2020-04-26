const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const apiKey = process.env.MAIL_KEY;
const listId = process.env.LIST_ID;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {

  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let auth = 'boda1 ' + apiKey;
  let data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  let jsonData = JSON.stringify(data);

  let options = {
    url: 'https://us8.api.mailchimp.com/3.0/lists/' + listId,
    method: "POST",
    headers: {
      "Authorization": auth,
    },
    body: jsonData
  };

  request(options, function (error, response, body) {
    if (error) {
      res.sendFile(__dirname + '/failure.html');
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }
    }
  });
});

app.listen(3000, function () {
  console.log('server started on port 3000');
});
