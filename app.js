var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var UUID = require('uuid-1345');

//app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', extended: false }))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/info.html'));
});

app.get('/store', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/store.html'));
});

app.post('/store', function (req, res) {
    var json;
    console.log('Request type: ' + req.headers['content-type']);
    if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        console.log("Build JSON from form data");
        json = {
            name: req.body.name,
            content: req.body.content
        };
    }
    else {
        json = req.body;
    }
    var name = json.name;
    UUID.v3({
        namespace: "c318e388-76c3-4b32-85ac-7e7a5ee08c63",
        name: name
    }, function (err, result) {
        console.log("Generated a name-based UUID using MD5:\n\t%s\n", result);
        var blobfile = path.join(__dirname, 'blobs', result);
        fs.writeFile(blobfile, json, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved: " + name + " as " + result);
        });
    });
    res.send("OK\n");
});

app.get('/retrieve/:name', function (req, res) {
});

app.listen(3000, function () {
    console.log('index access service listening on port 3000');
});
