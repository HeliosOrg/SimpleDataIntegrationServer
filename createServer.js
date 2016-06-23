var fs = require('fs');

var INITIALIZE_TYPE_MAP = {
  "int": 0,
  "FString": "\"\"",
  "bool": false,
  "float": 0
}

var json_data = JSON.parse(fs.readFileSync('input.json', 'utf8'));

var serverString = "var express = require('express');\n\
var bodyParser = require('body-parser');\n\
var app = express();\n\
var Redis = require('ioredis');\n\
var redis = new Redis();\n\
\n\
app.use(bodyParser.json());\n\
app.use(bodyParser.urlencoded({ extended: true}));\n\n";

json_data['single_instance_variables'].forEach(function(sVariable) {
  serverString += "redis.set(\'" + sVariable.name.toLowerCase() + "\', " + INITIALIZE_TYPE_MAP[sVariable.type] + ");\n"
});

serverString += "\n";

json_data['single_instance_variables'].forEach(function(mVariable) {
  var resultString = "JSON.parse(result)";
  if (mVariable.type == 'FString') {
    resultString = "result";
  }
  serverString += "app.get(\'/helios/" + mVariable.name.toLowerCase() + "\', function(req, res) { redis.get(\'" + mVariable.name.toLowerCase() + "\', function(err, result) { res.json({ value: " + resultString + " }); }); });\n";
  serverString += "app.post(\'/helios/" + mVariable.name.toLowerCase() + "\', function(req, res) { redis.set(\'" + mVariable.name.toLowerCase() + "\', req.body.value, function(err, result) { res.json(true); }); });\n\n";
});

serverString += "app.listen(80);\n";

fs.writeFile("server.js", serverString, function(err) {
  if (err)
    return console.log(err);
  console.log("server successfully generated");
});

/* debugging console log */
console.log(serverString);

