require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
// const { response } = require('express');

const TIMEOUT = 1000;

let connection = mongoose.connect
	(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

const urlSchema = new mongoose.Schema({
	original_url: { type: String, required: true },
	short_url: { type: Number, required: true, default: 0 },
	timestamp: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

const insertAndSaveUrl = (input, done) => {
	// Get Hostname and Aactual URL extracted from input URL
	let hostname = extractUrlHostName(input).hostname;
	let originalUrl = extractUrlHostName(input).address;
	console.log(`hostname: ${hostname}; originalUrl: ${originalUrl}`);
	if (hostname === undefined || originalUrl === undefined) {
		console.log(`Invalid url: ${hostname}, ${originalUrl}`);
		done(null, { error: "Invalid URL" });
		return console.log(`Error extracting hostname from original URL`);
	}

	// Check with DNS if the hostname is valid
	dns.lookup(hostname, (lookupError, address) => {

		// Return Invalid URL json if the hostname is invalid
		if (lookupError) {
			done(null, { error: "Invalid URL" });
			return console.log(`Error in dns lookup: ${lookupError}`);
		}

		// Find the URL in DB if it already exist
		findUrlByAddress(originalUrl, function (request, response, next) {
			console.log(`findUrl Result: ${response}`);
			let t = setTimeout(() => {
				next({ message: "Timeout" });
			}, TIMEOUT);
			clearTimeout(t);

			// If there is no response / the URL is not found in DB
			if (!response) {

				// Get the total count of documents / records in DB
				URL.estimatedDocumentCount((countError, count) => {
					if (countError) {
						done(null, countError);
						return console.log(`Error in estimating the document count: ${countError}`);
					}

					// Form a URL object as per schema & insert into DB
					let urlObject = URL({ original_url: originalUrl, short_url: count + 1 });
					URL.create(urlObject, (createError, urlCreated) => {
						if (createError) {
							done(null, createError);
							return console.log(`Error creating document: ${createError}`);
						}
						done(null, urlCreated);
					});
				});
			}

			// If there is response / URL found in DB
			else {
				console.log(`findUrl Result: ${response}`);
				done(null, response);
			}
		});
	});
	// let newUrl = URL({ original_url: input, short_url: 0 });
	// newUrl.save(function (err, urlInserted) {
	// 	if (err) return console.log(`Error in save: ${err}`);
	// 	console.log(`Insert and Save URL: ${urlInserted}`)
	// 	done(null, urlInserted);
	// });
};

const findUrlByAddress = (input, done) => {
	console.log(`Input to findUrlByAddress: ${input}`);
	URL.findOne({ original_url: input }, function (err, urlFound) {
		if (err) return console.log(`Error in findUrl: ${err}`);
		console.log(`findUrl: ${urlFound}`);
		done(null, urlFound);
		return urlFound;
	});
};

const findUrlById = (input, done) => {
	URL.findOne({ short_url: input }, function (err, urlFound) {
		if (err) {
			console.log(`Error in findUrlById: ${urlFound}`);
			return { error: "Invalid URL" };
		}
		if (urlFound == null) {
			// console.log(`ResponseCode: ${response.statusCode}`);
			done(null, ({ error: "Invalid URL" }));
			return ({ error: "Invalid URL" });
		}
		console.log(`findUrlById: ${urlFound}`);
		done(null, urlFound);
	});
};

const extractUrlHostName = (url) => {
	// Validate the input url
	let match = url.match(/^(http)s?:\/\/([\w][^\/=\s]+)\/?|(^w{3}[\.\w][^\/\=\s]{2,})\/?/mgi);
	let hostname, address;
	// console.log('match: ' + typeof match[0]);
	if (match != null && match.length > 0 && typeof match[0] === 'string' && match[0].length > 0) {
		// Replace url scheme & subdirecotries leaving the hostname
		address = match[0].endsWith('/') ? match[0].replace(/\/?$/i, '/') : match[0].replace(/\/?$/i, '');
		hostname = match[0].replace(/^(?:http|ftp)s?:\/\//i, '').replace(/\/?$/i, '').replace(/(^w{3}[\.])?/i, '');
		console.log('Extracted Hostname: ' + hostname);
		console.log('Extracted Address: ' + address);
	}
	// Return only the extracted hostname
	// console.log('Match2: ' + hostname);
	return { hostname, address };
}


exports.URLModel = URL;
exports.insertAndSaveUrl = insertAndSaveUrl;
exports.findUrlByAddress = findUrlByAddress;
exports.findUrlById = findUrlById;