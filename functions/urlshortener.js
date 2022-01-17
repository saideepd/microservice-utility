require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

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

const insertURL = (urlInput, done) => {
	let hostname = getHostname(urlInput);
	dns.lookup(hostname, (lookupError, address) => {
		if (lookupError)
			return console.log(`Error in dns.lookup: ${lookupError}; Address: ${address};`);
		else {
			let urlFound = findByUrl(urlInput);
			if (!urlFound) {
				URL.estimatedDocumentCount((countError, count) => {
					if (countError) {
						return (`Error in estimatedDocumentCount: ${countError}`);
					}
					let urlObj = URL({ original_url: urlInput, short_url: count + 1 });
					URL.create(urlObj, function(createError, insertedData) {
						if (createError)
							return console.log(`Error in URL.create(): ${createError}`);
						console.log(insertedData);
						return JSON.stringify({original_url: insertedData.original_url, short_url: insertedData.short_url});
						// done(null, insertedData);
					});
					// return console.log(`Error in urlFound: ${urlFound}`);
					// done(null, doesUrlExist);

				});
			}
			else {
				console.log(JSON.stringify({ original_url: urlFound.original_url, short_url: urlFound.short_url }))
			}
		}
	})
};

const findByUrl = (urlInput, done) => {
	URL.findOne({ original_url: urlInput }, function(findError, urlFound) {
		if (findError) return console.log(`Error in URL.findOne(): ${findError}`);
		console.log(`Find By Url: ${urlFound}`);
		// done(null, urlFound);
		return urlFound;
	});
}


const findByShortUrl = (shortUrlInput) => {
	URL.findOne({ short_url: shortUrlInput }, function(findError, urlFound) {
		if (findError) return console.log(`Error in findByShortUrl.findOne(): ${findError}`);
		console.log(`Find By Short Url: ${urlFound}`);
		// done(null, urlFound);
		console.log(`Type of urlFound: ${typeof urlFound}`);
		return urlFound;
	});
};

const getHostname = (url) => {
	let hostname = url
		.replace(/https[s]?\:\/\//, '')
		.replace(/\/(.+)?/, '');
	return hostname;
}

function postUrl(urlInput) {
	console.log(`Post input: ${urlInput}`);
	let insertResult = insertURL(urlInput);
	console.log(`Inserted Data: ${insertResult}`);
	return JSON.stringify({ method: 'POST', url: urlInput });
}

function getUrl(urlInput) {
	// return JSON.stringify({ method: 'GET', url: urlInput });
console.log(`getUrl Input print: ${urlInput}`);

console.log(`Direct findByShortUrl print: ${findByShortUrl(urlInput)}`);
	let getShortUrl = findByShortUrl(urlInput);
	console.log(`Typeof getShortUrl: ${typeof getShortUrl}`);
	console.log(`GetUrl: ${getShortUrl}`);
	return getShortUrl;

	// let hostname = getHostname(urlInput);
	// dns.lookup(hostname, (lookupError, address) => {
	// 	if (lookupError)
	// 		return console.log(`$Error in dns.lookup: {err}; Address: ${address};`);
	// 	else {
	// 		let urlFound = findByUrl(urlInput);
	// 		if (!urlFound) {

	// 			return console.log(`Error in urlFound: ${urlFound}`);
	// 			// done(null, doesUrlExist);
	// 		}
	// 		else {
	// 			console.log(JSON.stringify({ original_url: urlFound.original_url, short_url: urlFound.short_url }))
	// 		}
	// 	}
	// })
}

// module.exports = { postUrl, getUrl, findByShortUrl };
exports.URLModel = URL;
exports.postUrl = postUrl;
exports.getUrl = getUrl;
exports.findByShortUrl = findByShortUrl;