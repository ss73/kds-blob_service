var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')

//app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/info.html'));
});

app.get('/store', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/store.html'));
}); 

app.post('/store', function(req, res) {
    var json;
    console.log('Request type: ' + req.type);
    if(req.type == 'application/x-www-form-urlencoded') {
        json = {
            name : req.body.name,
            content : req.body.content};
    }
    else {
        json = req.body;
    }
    var name = json.name;
    
    res.send("OK\n");
});

app.get('/retrieve/:name', function(req, res){
});

app.listen(3000, function () {
    console.log('index access service listening on port 3000');
});
