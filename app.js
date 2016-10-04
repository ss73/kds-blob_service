var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var UUID = require('uuid-1345');
var mustache = require('mustache');

app.use(function (req, res, next) {
    var content_type = req.headers['content-type'];
    if (content_type != null && content_type.startsWith('application/x-www-form-urlencoded')) {
        req.url = "/form" + req.url;
        console.log("New 'virtual' URL: " + req.url);
    }
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/info.html'));
});

app.get('/store', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/store.html'));
});

// Virtual URL used when posting a form, URL is prepended with /form/
app.post('/form/store', function (req, res) {
    console.log(req.body);
    var json = {
        name: req.body.name,
        content: req.body.content
    };
    res.send(store(json));
});

app.post('/store', function (req, res) {
    var json = req.body;
    console.log(json);
    res.send(store(json));
});

function store(json) {
    UUID.v3({
        namespace: "c318e388-76c3-4b32-85ac-7e7a5ee08c63",
        name: json.name
    }, function (err, result) {
        // Generated a name-based UUID using MD5 in 'result'
        var blobfile = path.join(__dirname, 'blobs', result);
        fs.writeFile(blobfile, JSON.stringify(json), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved: '" + json.name + "' as " + result);
            return result;
        });
    });
    return "success\n";
}

app.get('/retrieve', function (req, res) {
    fs.readdir(path.join(__dirname, 'blobs'), function (err, files) {
        var presentation = [];
        var template = "<ul>{{#rows}}<li><a href='/retrieve/{{filename}}'>{{filename}}</a></li>{{/rows}}</ul>";
        for (i in files) {
            presentation.push({ filename: files[i] });
        }
        var view = { rows: presentation };
        var html = mustache.to_html(template, view);
        res.send(html);
    });
});

app.get('/retrieve/:name', function (req, res) {
    var uuid;
    if (req.params.name.length == 36) {
        try {
            uuid = new UUID(req.params.name);
            var blobfile = path.join(__dirname, 'blobs', uuid);
            console.log("Sending: " + blobfile);
            res.sendFile(blobfile);
        }
        catch (err) {
            console.log("Not a UUID, trying name lookup");
        }
    } else {
        UUID.v3({
            namespace: "c318e388-76c3-4b32-85ac-7e7a5ee08c63",
            name: req.params.name
        }, function (err, result) {
            var blobfile = path.join(__dirname, 'blobs', result);
            console.log("Sending: " + blobfile);
            res.sendFile(blobfile);
        });
    }
});

app.listen(3000, function () {
    console.log('Blob service listening on port 3000');
});
