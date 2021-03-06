require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

const TIMEOUT = 10000;

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
		findUrlByAddress(input, function (request, response, next) {
			console.log(`findUrl Result: ${response}`);
			let t = setTimeout(() => {
				next({ message: "Timeout" });
			}, TIMEOUT);
			clearTimeout(t);

			// If there is no response / the URL is not found in DB
			if (!response) {

				// Get the max short_url of records in DB
				URL.find({})
					.sort({ short_url: 'desc' })
					.limit(1)
					.select('short_url')
					.exec((countError, data) => {
						if (countError) {
							console.log(`Error finding max Id: ${countError}`);
							done(null, countError);
							return { error: countError };
						}
						const maxCount = JSON.parse(JSON.stringify(data))
							.map((item) => {
								return item.short_url;
							});

						console.log(`Max count: ${maxCount}; ${typeof maxCount}; ${typeof JSON.parse(maxCount)}`);

						// Form a URL object
						let urlObject = URL({ original_url: input, short_url: JSON.parse(maxCount) + 1 });

						// Create a record in the DB for URL object formed above
						URL.create(urlObject, (createError, urlCreated) => {
							if (createError) {
								createError.message = "Error creating record";
								done(null, createError);
								return console.log(`Error creating document: ${createError}`);
							}
							urlCreated.message = "Record created successfully";
							done(null, urlCreated);
						});
					});
			}

			// If there is response / URL found in DB
			else {
				response.message = "URL already exists";
				console.log(`findUrl Result: ${response}`);
				done(null, response);
			}
		});
	});
};

const findUrlByAddress = (input, done) => {
	console.log(`Input to findUrlByAddress: ${input}`);
	URL.findOne({ original_url: { $eq: input } }, function (err, urlFound) {
		if (err) {
			console.log(`Error in findUrlById: ${urlFound}`);
			done(null, ({ error: "Invalid URL", message: "There was some error while fetching data" }));
			return console.log(`Error in findUrl: ${err}`);
		}
		console.log(`findUrl: ${urlFound}`);
		done(null, urlFound);
		return urlFound;
	});
};

const findUrlById = (input, done) => {
	URL.findOne({ short_url: input }, function (err, urlFound) {
		if (err) {
			console.log(`Error in findUrlById: ${urlFound}`);
			done(null, ({ error: "Invalid URL", message: "There was some error while fetching data" }));
			return { error: "Invalid URL", message: "There was some error while fetching data" };
		}
		if (urlFound === null) {
			done(null, ({ error: "Invalid URL", message: "No record exists for provided input" }));
			return ({ error: "Invalid URL", message: "No record exists for provided input" });
		}
		urlFound.message = "URL found successfully";
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
	return { hostname, address };
}

// Not currently being used but logic is used in insertAndSaveUrl
const findMaxId = (_input, done) => {
	URL.find({}).sort({ short_url: 'desc' }).limit(1).select('short_url').exec((countError, data) => {
		if (countError) {
			console.log(`Error finding max Id: ${countError}`);
			done(null, countError);
			return { error: countError };
		}
		const maxCount = JSON.parse(JSON.stringify(data))
			.map((item) => {
				return item.short_url;
			});
		console.log(`findMaxId response: ${data}`);
		console.log(`maxCount value: ${maxCount}`);
		return maxCount;
	});
}

const removeUrlById = (input, done) => {
	URL.findOneAndRemove({ short_url: { $eq: input } }, (err, urlRemoved) => {
		if (err) {
			console.log(`Error removing record ${input}: ${err}`);
			done(null, { error: "Error removing record" });
			return { error: "Error removing record" };
		}
		if (urlRemoved === null) {
			console.log("No record exists for provided input");
			done(null, { message: "No record exists for provided input" });
			return { message: "No record exists for provided input" };
		}
		urlRemoved.message = "Record successfully removed";
		console.log(`Record successfully removed: ${urlRemoved}`);
		done(null, urlRemoved);
	});
}


exports.URLModel = URL;
exports.insertAndSaveUrl = insertAndSaveUrl;
exports.findUrlByAddress = findUrlByAddress;
exports.findUrlById = findUrlById;
exports.removeUrlById = removeUrlById;