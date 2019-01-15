var express = require('express');
var router = express.Router();
const axios = require('axios');
const request = require('request');
const editJsonFile = require("edit-json-file");


//working on this to create API url
function apiUrlCreator(inputUrl){
  var payloadUrl = 'https://cloud.mongodb.com/api/atlas/v1.0/groups/';
  var beginningOfGroupId = inputUrl.indexOf('/v2/');
  var beginningOfClusterName = inputUrl.indexOf('#clusters/detail/');
  payloadUrl = payloadUrl + inputUrl.slice(beginningOfGroupId+4,beginningOfClusterName) + '/clusters/' + inputUrl.slice(beginningOfClusterName+17, inputUrl.length);
  return payloadUrl;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('https://api.ipify.org')
    .then(response => {
      console.log(response.data);
      res.render('index', { title: 'Express', serverIp: response.data });
    })
    .catch(error => {
      console.log(error);
    });
});

//TODO - Make the "pruning" of the properties that aren't added to body more resilient
// - 1. Shawn's "Compare" method
// - 2. work with ReplicationSpec versus replicationSpecs
router.post('/',function(req, res){
  var payload = {}
  for(var prop in req.body.configData){
    //THESE ARE IMPORTANT TO NOTE IN THE DOCUMENTATION
    if(prop == 'mongoURI' || prop == 'stateName' || prop == 'mongoURIUpdated' || prop == 'mongoURIWithOptions' || prop == 'mongoDBVersion' || prop == 'replicationSpec'){
    }
    else {
      payload[prop] = req.body.configData[prop];
      console.log(prop);
    }
  }
  console.log("PAYLOAD=== " + JSON.stringify(payload));

  var options = {
    uri: payload.links[0].href,
    auth: {
      user: req.body.credentials.userNameInput, //'winston.vargo',
      pass: req.body.credentials.apiKeyInput, //'97b4b8f9-0861-4dcd-9115-9f8935db8f13',
      sendImmediately: false
    },
    method: 'PATCH',
    headers: {'content-type' : 'application/json'},
    body:  JSON.stringify(payload)
  };
  request(options, function(error, response, body){
    console.log("error: " + error);
  });

});

router.get('/try', function(req,res,next){
  apiUrlCreator(req.query.clusterURLInput);
  var options = {
  uri: apiUrlCreator(req.query.clusterURLInput),
  auth: {
    user: req.query.userNameInput,
    pass: req.query.apiKeyInput,
    sendImmediately: false
  }
  };
  request(options, function(error, response, body){
    res.send(response);
  });
});
module.exports = router;
