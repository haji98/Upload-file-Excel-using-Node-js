const express = require('express');
const app = express();
var busboy = require('connect-busboy');
const xlsx = require('node-xlsx');
var bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);

app.use(busboy());
// Add the router
app.use(express.static('views'));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Method POST to upload file
app.route('/upload')
    .post(function(req, res, next) {
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
            console.log("Uploading: " + filename);

            if (filename.split('.')[filename.split('.').length - 1] === 'xlsx') {
                //Path where file will be uploaded
                let saveTo = __dirname + '/uploads/' + filename;
                var uploadFile = fs.createWriteStream(saveTo);
                file.pipe(uploadFile);
                uploadFile.on('close', async function() {
                    console.log("Upload Finished of " + filename);
                    let studentArr = await parseExcel(saveTo);
                    res.status(200).send(studentArr);
                });
            } else {
                console.error("The uploaded file must be a file containing the extension is .xlsx!");
            }
        });
    });

// Asyns/ Await
async function parseExcel(path) {
    const obj = await xlsx.parse(path);
    return obj[0].data;
}

// Port
server.listen('8000', function() {
    console.log('Running http://localhost:8000');
});