const express = require('express');
const timestamp = require('./timestamp');
const urlshortener = require('./urlshortener');
const app = express();
const serverless = require('serverless-http');
const multer = require('multer');
const maxFileSize = 10 * 1000 * 1000;
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, limits: { fileSize: maxFileSize } }).single('upfile');
const router = express.Router();
const bodyParser = require('body-parser');

// enable CORS
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', parameterLimit: 100000, extended: true}));

// Hide X-powered-by header ;)
app.use(function (req, res, next) {
    res.header("X-powered-by", "Efforts, Sweat, Dedication and Desire");
    next();
});


const keyGenerator = function (req, res) {
    console.log(`IP Address: ${req.headers['publicIp']}, ${req.headers['ip']}, ${req.headers['client-ip']}`);
    return req.headers['publicIp'] || req.headers['ip'] || req.headers['client-ip'];
};

// Set up rate limiter: maximum of 10 requests per minute
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 Minute
    max: 60,
    skipSuccessfulRequests: true,
    keyGenerator: keyGenerator
});

// apply rate limiter to API requests
app.use('/api', limiter);
// apply rate limiter to static requests
app.use('/', limiter);

router.get("/", function (req, res) {

    let html = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Microservice Utility</title> <link href="https://i.ibb.co/4pshfgd/settings-gear-favicon.png" rel=icon type=image/png> <style> body {font-family: Courier, sans-serif;font-size: 1.5em;color: #222;background-color: #FaFaFa;text-align: center;line-height: 1.4em }.container {padding: 0;margin-top: 1em;margin-left: 2.5em;margin-right: 2.5em;margin-bottom: 2em;}h2 {margin-top: 1em;margin-bottom: 0.5em;}h3 {margin-top: 0.5em;margin-bottom: 0.5em;}h4 {margin: 0.5em;}hr {margin: 0em 1em;}footer {margin-top: 2em;margin-left: -0.45em;position: fixed;bottom: 0;width: -moz-available;width: -webkit-fill-available;background-color: #fafafa;box-shadow: 0 -1px 8px -1px rgba(128, 128, 128, 0.5);}.footer {margin-top: 0.25em;}code {font-family: monospace;padding: .5em;color: #000;background-color: #d3d3d3;}ul {list-style-type: none;margin: 0;}li {margin-bottom: .5em;}li:hover {cursor: pointer;}.description {font-size: 0.75em;}p {margin: auto;}a {color: #2574A9;}img {height: 24px;vertical-align: sub;}.row {display: flex;flex-direction: row;justify-content: center;}.btn {position: relative;display: block;margin: 25px;padding: 10px;overflow: hidden;border-width: 0;outline: none;border-radius: 3px;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);background-color: #2ecc71;color: white;font-size: large;transition: background-color 0.3s linear;}.btn:hover, .btn:focus {background-color: #27ae60;cursor: pointer;}.btn>* {position: relative;}.btn span {display: block;padding: 12px 24px;}.btn:before {content: "";position: absolute;top: 50%;left: 50%;display: block;width: 0;padding: 0;border-radius: 100%;background-color: rgba(236, 240, 241, 0.3);-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);}.btn:active::before {width: 120%;padding-top: 120%;transition: width 0.2s ease-out, padding-top 0.2s ease-out;}#submit-btn {margin: 0;display: initial;padding: 0.5em;font-size: medium;font-weight: bold;background-color: #0039cb;vertical-align: middle;}#submit-btn:focus, #submit-btn:hover {background-color: #0032af;cursor: pointer;}p.upload-file-msg {margin-bottom: 0.5em;}.upfile {width: -moz-available;width: -webkit-fill-available;text-align: center;background-color: #fafafa;color: black;padding: 0;padding-right: 0.5em;margin: 0 0 1em 0;font-size: medium;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;box-shadow: none;border: 1px solid #d43a4c;border-radius: 3px;}input[type="file"]::-webkit-file-upload-button, input[type="file"]::file-selector-button {margin: 0;margin-right: 0.5em;display: inline-block;padding: 0.8em;font-size: large;font-weight: bold;background-color: #d43a4c;color: white;border: none;border-radius: 3px;vertical-align: middle;box-sizing: border-box;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);}input[type="file"]::-webkit-file-upload-button:focus, input[type="file"]::file-selector-button:focus, input[type="file"]::-webkit-file-upload-button:hover, input[type="file"]::file-selector-button:hover {background-color: red;}.upfile:active, .upfile:before, .upfile:focus, .upfile:hover {background-color: #fffde7;color: black;}.upload-btn {width: -webkit-fill-available;width: -moz-available;}#url_label {font-weight: bold;vertical-align: text-top;}#url_input {height: 1.75em;width: 20em;border-radius: 3px;border: 1px solid grey;padding: 2px 10px;vertical-align: middle;text-align: center;}#url_input:focus {outline: none !important;border-color: black;box-shadow: 0 0 5px 3px rgba(128, 128, 128, 0.2);}fieldset {width: fit-content;display: block;margin-left: auto;margin-right: auto;border-radius: 5px;}code {line-break: anywhere;line-height: 2;}@media screen and (min-width: 150px) and (max-width: 550px) {body {font-size: large;}h2 {margin-bottom: 0.45em;}.container {margin: 0.5em;}.description {font-size: 1em;}.row {flex-direction: column;margin-top: 0.5em;}.btn {margin-top: 0.25em;margin-bottom: 0.25em;padding: 7px;}ul {padding: inherit;}fieldset {width: fit-content;display: grid;row-gap: 0.5em;}#url_input {width: auto;text-align: center;}#inputfield {padding: 0;}}</style> <script> function updateHTML(selection) {const parentElement = document.getElementsByClassName('container');const childElement = document.getElementsByClassName('content');const createElement = document.createElement('div');let s = document.createElement('div');createElement.className = 'content';s.className = 'content';switch (selection) {case 'timestamp': createElement.innerHTML = '<h2>Timestamp API</h2><h3>Example Usage:</h3><ul><li><a href="api/2022-01-15" title="Click to view the API in action">[project url]/api/2022-01-15</a><li><a href="api/1451001600000" title="Click to view the API in action">[project url]/api/1642204800000</a></ul><h3 class="exampleoutput">Example Output:</h3><p><code>{"unix":1642204800000,"utc":"Sat, 15 Jan 2022 00:00:00 GMT"}</code></p>';break;case 'whoami': createElement.innerHTML = '<h2>Who Am I API</h2><h3>Example Usage:</h3><ul><li><a href="api/whoami" title="Click to view the API in action">[project url]/api/whoami</a></ul><h3 class="exampleoutput">Example Output:</h3><p><code>{"ipaddress":"127.0.0.1","language":"en-US,en;q=0.5","software":"Mozilla/5.0 (X11;Ubuntu;Linux x86_64;rv:95.0) Gecko/20100101 Firefox/95.0"}</code></p>';break;case 'urlshortener': createElement.innerHTML = '<h2>URL Shortener API</h2> <h3>Example Usage:</h3> <ul> <li><a href="api/shorturl/1" title="Click to view the API in action">[project url]/api/shorturl/1</a> </ul> <section> <form action="api/shorturl" method="POST"> <fieldset> <legend align="center">URL Shortener</legend> <label id="url_label" for="url_input">URL:</label> <input id="url_input" type="text" name="url" placeholder="https://www.freecodecamp.org/" title="Enter URL" required> <input class="btn" id="submit-btn" type="submit" value="POST URL" title="Submit to shorten URL"> </fieldset> </form> </section> <h3 class="exampleoutput">Example Output:</h3> <p><code>{"original_url":"https://www.freecodecamp.org/","short_url":1}</code></p>';break;case 'metadata': createElement.innerHTML = '<h2>File Metadata API</h2> <p class="upload-file-msg">Please Upload a File...</p> <section> <form enctype="multipart/form-data" action="/api/fileanalyse" method="POST"> <fieldset> <legend align="center">File Analyzer</legend> <input class="btn upfile" id="inputfield" type="file" name="upfile" title="Choose a file to upload" required> <input class="btn upload-btn" id="submit-btn" type="submit" value="Upload &mapstoup;" title="Submit to analyze your file"> </fieldset> </form> </section> <h3 class="exampleoutput">Example Output:</h3> <p><code>{"name":"github_icon.png", "type":"image/png","size":224}</code> </p>';break;default: createElement.innerHTML = '<h3>Click any of the Microservice API Button to view their usage and examples</h3>';break;}parentElement[0].replaceChild(createElement, childElement[0]);} </script> </head> <body> <h2>Microservice Utility </h2> <hr> <div class="row"> <button class="btn" onclick="updateHTML('timestamp')" name="timestamp" title="Click for more info about Timestamp Microservice API">Timestamp Microservice</button> <button class="btn" onclick="updateHTML('whoami')" name="whoami" title="Click for more info about Who Am I Microservice API">Who Am I Microservice</button> <button class="btn" onclick="updateHTML('urlshortener')" name="urlshortener" title="Click for more info about URL Shortener Microservice API">URL Shortener Microservice</button> <button class="btn" onclick="updateHTML('metadata')" name="metadata" title="Click for more info about File Metadata Microservice API">File Metadata Microservice</button> </div> <div class="container"> <div class="content"> <h3>A set of different Microservice APIs built using Express JS which serve different purpose. </h3> <p class="description">Click the microservice API buttons above to find more info about the APIs and how to use them.</p> </div> </div> <footer> <p class="footer">By <a href="https://github.com/saideepd" title="View Saideep's GitHub projects">Saideep Dicholkar </a> <img alt="GitHub Logo" src="https://i.ibb.co/W0Jhcgj/github-icon-grey.png"> </p> </footer> </body> </html>`;
    res.send(html);
});


// Simple Hello API endpoint
router.get("/api/hello", function (req, res) {
    res.json({ greeting: 'Hello API' });
});


// Request Header Parser API endpoint
router.get("/api/whoami", function (req, res) {
    res.json({
        ipaddress: req.headers['client-ip'] || req.headers['x-forwarded-for'] || req.socket.address().address || null,
        language: req.headers['accept-language'],
        software: req.headers['user-agent']
    });
});


// Date API endpoint... 
router.get("/api/:date?", function (req, res) {
    let dateInput = req.params.date;
    let currentDate = timestamp(dateInput);

    if (currentDate.toString() === 'Invalid Date') {
        res.json({
            error: currentDate.toString()
        });
    }
    else {
        res.json({
            unix: currentDate.getTime(),
            utc: currentDate.toUTCString()
        });
    }
});


// URL Shortener API endpoint
router.post('/api/shorturl', function (req, res, next) {
    let decodedInputUrl = req.body.url ?? decodeURIComponent(req.body).replace("url=", "");
    console.log(`Input Body: ${decodedInputUrl}`);
    // Handle Blank or null or undefined input value
    if (!decodedInputUrl || decodedInputUrl.length == 0 || decodedInputUrl.match(/^(\+)+$/ig)) {
        console.log('Blank Input');
        return res.json({ error: "Invalid input" });
    }
    urlshortener.insertAndSaveUrl(decodedInputUrl, function (err, data) {
        if (err) {
            console.log(`Error in response: ${err}`);
            return next(err);
        }
        else if (!data) {
            console.log('Missing `done()` argument');
            res.json({ message: "Error creating record" });
            return next({ message: "Error creating record" });
        }
        else if (JSON.stringify(data).includes('error')) {
            console.log(`Error in response data: ${JSON.stringify(data)}`);
            console.log('Does data include error: ' + JSON.stringify(data).includes('error'));
            res.json({ error: "Invalid URL" });
        }
        else if (Object.entries(data).length == 0) {
            res.json({ error: "Invalid URL" });
        }
        else {
            console.log(`Response Data: ${data}`);
            res.json({ original_url: data.original_url, short_url: data.short_url });
            // res.json({ original_url: data.original_url, short_url: data.short_url, message: data.message, error: data.error });
        }
    });
});

router.get('/api/shorturl/:id?', function (req, res, next) {
    console.log(`Input Id: ${req.params.id}`);
    let errorJSON = { error: "Invalid URL", message: "No record exists for provided input" };

    // Check if input Id is number
    if (!req.params.id.match(/[\D+]/ig)) {
        urlshortener.findUrlById(req.params.id, function (err, data) {
            if (err) {
                console.log(`Error in response: ${err}`);
                res.json(errorJSON);
                return next(err);
            }
            else if (!data) {
                console.log('Missing `done()` argument');
                res.json(errorJSON);
                return next({ message: "Missing callback argument" });
            }
            else {
                console.log(`Response Data: ${JSON.stringify(data)}`);
                // res.json({ original_url: data.original_url, short_url: data.short_url, message: data.message, error: data.error });
                res.redirect(data.original_url);
            }
        });
    }
    else {
        res.json(errorJSON);
    }
});

router.delete('/api/shorturl', function (req, res, next) {
    console.log(`Input Body: ${req.body}`);
    urlshortener.removeUrlById(JSON.parse(req.body).short_url, function (err, data) {
        if (err) {
            console.log(`Error in response: ${err}`);
            return next(err);
        }
        if (!data) {
            console.log('Missing `done()` argument');
            // return next({message: "Missing callback argument"});
            res.json({ message: data.message })
            return next({ message: data.message });
        }
        else {
            console.log(`Response Data: ${JSON.stringify(data)}`);
            res.json({ original_url: data.original_url, short_url: data.short_url });
            // res.json({ original_url: data.original_url, short_url: data.short_url, message: data.message, error: data.error });
        }
    });
});

// File Metadata API Endpoint
router.post('/api/fileanalyse', function (req, res, next) {
    upload(req, res, (err) => {
        if (err || req.file.size > 10000000) {
            console.log(`Error uploading file: ${err}`);
            res.json({ "error": "The file is too large" });
            return next(err);
        }
        else {
            if (req.file) {
                const { originalname: name, mimetype: type, size } = req.file;
                console.log(`File Details - originalname: ${name}, mimetype: ${type}, size: ${size}`);
                res.json({ "name": name, "type": type, "size": size });
                return next({ "name": name, "type": type, "size": size });
            }
            else if (res.statusCode >= 400 && res.statusCode <= 499) {
                console.log(`400 Error: ${res.statusCode}, ${res.statusMessage}`);
                res.json({ "error": "Please upload a file" });
                return next({ "error": "Please upload a file" });
            }
            else if (res.statusCode >= 500 && res.statusCode <= 599) {
                console.log(`500 Error: ${res.statusCode}, ${res.statusMessage}`);
                res.json({ "error": "There was some error uploading file to the server" });
                return next({ "error": "There was some error uploading file to the server" });
            }
            else {
                console.log(`Else Error: ${res.statusCode}, ${res.statusMessage}`);
                res.json({ "error": "Please upload a file" });
                return next({ "error": "Please upload a file" });
            }
        }
    });
});

app.use('/', router);

module.exports.handler = serverless(app);