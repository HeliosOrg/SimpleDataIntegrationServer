var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Redis = require('ioredis');
var redis = new Redis();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

redis.set('islighton', false);
redis.set('numkills', 0);
redis.set('username', "");
redis.set('winpercentage', 0);

app.get('/helios/islighton', function(req, res) { redis.get('islighton', function(err, result) { res.json({ value: JSON.parse(result) }); }); });
app.post('/helios/islighton', function(req, res) { redis.set('islighton', req.body.value, function(err, result) { res.json(true); }); });

app.get('/helios/numkills', function(req, res) { redis.get('numkills', function(err, result) { res.json({ value: JSON.parse(result) }); }); });
app.post('/helios/numkills', function(req, res) { redis.set('numkills', req.body.value, function(err, result) { res.json(true); }); });

app.get('/helios/username', function(req, res) { redis.get('username', function(err, result) { res.json({ value: result }); }); });
app.post('/helios/username', function(req, res) { redis.set('username', req.body.value, function(err, result) { res.json(true); }); });

app.get('/helios/winpercentage', function(req, res) { redis.get('winpercentage', function(err, result) { res.json({ value: JSON.parse(result) }); }); });
app.post('/helios/winpercentage', function(req, res) { redis.set('winpercentage', req.body.value, function(err, result) { res.json(true); }); });

app.listen(80);
