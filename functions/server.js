const express = require('express');
const timestamp = require('./timestamp');
const app = express();
const serverless = require('serverless-http');
const router = express.Router();

// enable CORS
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// Hide X-powered-by header ;)
app.use(function (req, res, next) {
    res.header("X-powered-by", "Efforts, Sweat, Dedication and Desire");
    next();
});

// Set up rate limiter: maximum of 10 requests per minute
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1*60*1000, // 1 Minute
    max: 60
});

// apply rate limiter to API requests
app.use('/api', limiter);
// apply rate limiter to static requests
app.use('/', limiter);

router.get("/", function(req, res) {

    let currentDate = new Date();
    let jsonDateTime = JSON.stringify({ unix: currentDate.getTime(), utc: currentDate.toUTCString() });

    let html = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Microservice Utility</title> <link href="https://i.ibb.co/4pshfgd/settings-gear-favicon.png" rel=icon type=image/png> <style> body { font-family: Courier, sans-serif; font-size: 1.5em; color: #222; background-color: #FaFaFa; text-align: center; line-height: 1.4em } .container { padding: 0; margin-top: 1em; margin-left: 2.5em; margin-right: 2.5em; } h2 { margin-top: 1em; } h3 { margin-top: 0.5em; } h4 { margin: 0.5em; } hr { margin: 0em 1em; } footer { margin-top: 2em; position: fixed; bottom: 0; width: 100%; } code { font-family: monospace; padding: .5em; color: #000; background-color: #d3d3d3; } ul { list-style-type: none; } li { margin-bottom: .5em; } li:hover { cursor: pointer; } .description { font-size: 0.75em; } a { color: #2574A9; } img { height: 24px; vertical-align: sub; } .row { display: flex; flex-direction: row; justify-content: center; } .btn { position: relative; display: block; margin: 25px; padding: 10px; overflow: hidden; border-width: 0; outline: none; border-radius: 3px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6); background-color: #2ecc71; color: white; font-size: large; transition: background-color 0.3s linear; } .btn:hover, .btn:focus { background-color: #27ae60; cursor: pointer; } .btn>* { position: relative; } .btn span { display: block; padding: 12px 24px; } .btn:before { content: ""; position: absolute; top: 50%; left: 50%; display: block; width: 0; padding: 0; border-radius: 100%; background-color: rgba(236, 240, 241, 0.3); -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(-50%, -50%); } .btn:active::before { width: 120%; padding-top: 120%; transition: width 0.2s ease-out, padding-top 0.2s ease-out; } @media screen and (min-width: 300px) and (max-width: 550px) { body { font-size: large; } .container { margin: 0.5em; } .description { font-size: 1em; } } </style> <script> function updateHTML(selection) { const parentElement = document.getElementsByClassName('container'); const childElement = document.getElementsByClassName('content'); const createElement = document.createElement('div'); createElement.className = 'content'; let innerthtml; switch (selection) { case 'timestamp': innerthtml = createElement.innerHTML = '<h2>Timestamp API</h2><h3>Example Usage:</h3><ul><li><a href="api/2022-01-15" title="Click to view the API in action">[project url]/api/2022-01-15</a><li><a href="api/1451001600000" title="Click to view the API in action">[project url]/api/1642204800000</a></ul><h3 class=exampleoutput>Example Output:</h3><p><code>${jsonDateTime}</code>'; break; case 'whoami': innerthtml = createElement.innerHTML = '<h2>Who Am I API</h2><h3>Example Usage:</h3><ul><li><a href="api/whoami" title="Click to view the API in action">[project url]/api/whoami</a></ul><h3 class=exampleoutput>Example Output:</h3><p><code>{"ipaddress":"127.0.0.1","language":"en-US,en;q=0.5","software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0"}</code>'; break; default: innerthtml = createElement.innerHTML = '<h3>Click any of the Microservice API Button to view their usage and examples</h3>'; break; } parentElement[0].replaceChild(createElement, childElement[0]); } </script> </head> <body> <h2>Microservice Utility</h2> <hr> <div class="row"> <button class="btn" onclick="updateHTML('timestamp')" name="timestamp" title="Click for more info about Timestamp Microservice API">Timestamp Microservice</button> <button class="btn" onclick="updateHTML('whoami')" name="whoami" title="Click for more info about Who Am I Microservice API">Who Am I Microservice</button> </div> <div class=container> <div class="content"> <h3>A set of different Microservice APIs built using Express JS which serve different purpose.</h3> <p class="description"> Click the microservice API buttons above to find more info about the APIs and how to use them. </p> </div> </div> <footer> <p> By <a href="https://github.com/saideepd" title="View Saideep's GitHub projects">Saideep Dicholkar</a> <img alt="GitHub Logo" src="https://i.ibb.co/W0Jhcgj/github-icon-grey.png"> </p> </footer> </body> </html>`;
    res.send(html);
});


// Simple Hello API endpoint
router.get("/api/hello", function(req, res) {
    res.json({ greeting: 'Hello API' });
});


// Request Header Parser API endpoint
router.get("/api/whoami", function(req, res) {
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


app.use('/', router);

module.exports.handler = serverless(app);