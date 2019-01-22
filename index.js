const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');
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

// app.use(bodyParser.json());

app.get('/images', (req, res) => {
    db.getImages()
        .then((data) => {
            console.log("dataaaaaa: ", data);
            res.json({
                images: data.rows
            });
        }).catch((err) => {
            console.log("error", err);
        });
});

// app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
//     db.addImage(
//         req.body.title,
//         req.body.username,
//         req.body.desc,
//         config.s3Url + env.file.filename
//     ).then(({rows}) => {
//         res.json(row[0]);
//     });
//
// });
app.listen(8080, () => console.log(`Listening!`));
