const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db.js');
const s3 = require('./s3.js');
const config = require('./config.json');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

app.use(express.static(__dirname + '/public'));

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

app.use(bodyParser.json());

app.get('/images', (req, res) => {
    db.getImages()
        .then((data) => {
            res.json({
                images: data.rows
            });
        }).catch((err) => {
            console.log("error", err);
        });
});
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    if (req.file) {
        return db.addImage(
            config.s3Url + req.file.filename,
            req.body.name,
            req.body.title,
            req.body.desc).then(({rows}) => {
            res.json(rows[0]);
        }).catch(err => console.log(err));
    } else {
        res.json({
            success: false
        });
    }
});
app.get('/modal/:id', (req, res) => {
    const imageid = req.params.id;
    db.getImageById(imageid).then(result => {
        res.json(result.rows);
    }).then((imageid) => {
        db.getComments(imageid).then((results) => {
            res.json(results.comments);
        });
    })
        .catch(err => {
            console.log('db.queryModalInfo() error: ', err);
        });
});

app.post('/addcomment', (req, res) => {
    db.addComment(req.body.comment, req.body.username, req.body.image_id).then((results) => {
        res.json(results.rows);
    });
});

app.get('/comments/:id', (req, res) => {
    db.getComments(req.params.id).then((results) => {
        console.log("resultsss", results);
        res.json(results.rows);
    });
});

app.listen(8080, () => console.log(`Listening!`));
