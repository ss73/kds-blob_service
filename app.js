var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var UUID = require('uuid-1345');
var mustache = require('mustache');

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
        // Generated a name-based UUID using MD5 in 'result'
        var blobfile = path.join(__dirname, 'blobs', result);
        fs.writeFile(blobfile, JSON.stringify(json), function (err) {
            if (err) {
                return console.log(err);
            }
            res.send("Saved: '" + name + "' as " + result);
        });
    });
});

app.get('/retrieve', function (req, res) {
    fs.readdir(path.join(__dirname, 'blobs'), function (err, files) {
        var presentation = [];
        var template = "<ul>{{#rows}}<li>{{filename}}</li>{{/rows}}</ul>";
        for (i in files) {
            presentation.push({ filename: files[i] });
        }
        var view = { rows: presentation };
        var html = mustache.to_html(template, view);
        res.send(html);
    });    
});

app.get('/retrieve/:name', function (req, res) {
    UUID.v3({
        namespace: "c318e388-76c3-4b32-85ac-7e7a5ee08c63",
        name: req.params.name
    }, function (err, result) {
        var blobfile = path.join(__dirname, 'blobs', result);
        res.sendFile(blobfile);
    });
});

app.listen(3000, function () {
    console.log('index access service listening on port 3000');
});
