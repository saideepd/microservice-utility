# Microservice Utility

It is a set of different Microservice APIs built using Express JS which serve different purpose.

These microservices are built as a part of [freeCodeCamp Backend Development and APIs](https://www.freecodecamp.org/learn/back-end-development-and-apis/ "View the freeCodeCamp Backend Development APIs course") project.

### Different microservices available are:

## 1. Timestamp Microservice API

Timestamp Microservice API parses the input date and returns the UNIX and UTC timestamps for the provided input.

Access the API using either of these 2 services:
- Netlify: [https://microservice-utility.netlify.app/api/](https://microservice-utility.netlify.app/api/ "Timestamp Microservice API hosted on Netlify")
- Replit: [https://timestamp-microservice.saideepd.repl.co/](https://timestamp-microservice.saideepd.repl.co/ "Timestamp Microservice API hosted on Replit")

### Example Usage:
- [[project url]/api/2015-12-25](https://microservice-utility.netlify.app/api/2022-01-15)
- [[project url]/api/1642204800000](https://microservice-utility.netlify.app/api/1451001600000)

### Example Output:
```json
{
    "unix": 1642204800000,
    "utc": "Sat, 15 Jan 2022 00:00:00 GMT"
}
```
#### Screenshot:
![Timestamp Microservice API](https://user-images.githubusercontent.com/30663492/151173843-47be7332-f65c-46bb-b719-9a7844a92e11.png "Timestamp Microservice API")


## 2. Who Am I Microservice API

Who Am I Microservice API is a Request Header Parser that provides client information of the user consuming the API. It provides the Client's IP address, Browser Language and the Browser's User Agent used for browsing the internet.

Access the API using either of these 2 services:
- Netlify: [https://microservice-utility.netlify.app/api/whoami](https://microservice-utility.netlify.app/api/whoami "Who Am I Microservice API hosted on Netlify")
- Replit: [https://request-header-parser-microservice.saideepd.repl.co/](https://request-header-parser-microservice.saideepd.repl.co/ "Who Am I Microservice API hosted on Replit")

### Example Usage:
- [[project url]/api/whoami](https://microservice-utility.netlify.app/api/whoami)

### Example Output:
```json
{
  "ipaddress": "183.87.11.36",
  "language": "en-GB,en-US;q=0.9,en;q=0.8",
  "software": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
}
```
#### Screenshot:
![Who Am I Microservice API](https://user-images.githubusercontent.com/30663492/151174071-51f5eeae-e3ec-4bd9-bcac-e710c54442dd.png "Who Am I Microservice API")


## 3. URL Shortener Microservice API

URL Shortener Microservice API is a service that helps you to shorten your lengthy website URLs with simple shorter URLs that are easy to remember & quick to type. This service uses MongoDB as database to store & retrieve the URLs.

Access the API using either of these 2 services:
- Netlify: [https://tyni.netlify.app](https://tyni.netlify.app "URL Shortener Microservice API hosted on Netlify")
- Replit: [https://tinyurl.saideepd.repl.co/](https://tinyurl.saideepd.repl.co/ "URL Shortener Microservice API hosted on Replit")

### Example Usage:
- [[project url]/api/shorturl/1](https://tyni.netlify.app/api/shorturl/1)

### Example Output:
```json
{
  "original_url": "https://www.freecodecamp.org/",
  "short_url": 1
}
```
#### Screenshot:
![URL Shortener Microservice API](https://user-images.githubusercontent.com/30663492/151174281-fa71b64d-446d-44ab-b6ea-c60496804909.png "URL Shortener Microservice API")


## 4. File Metadata Microservice API

File Metadata Microservice API is a service that helps you to analyse your files by knowing its metadata. This app provides a simple UI to upload your files & the API provides information of the file like its name, type & size.
The API uses Multer as a middleware to handle file uploads. Currently the API is configured to only accept files below 10 Mb in size due to server limitations, but that can be configured as per requirements & server plans.

Access the API using either of these 2 services:
- Netlify: [https://metafile.netlify.app](https://metafile.netlify.app "File Metadata Microservice API hosted on Netlify")
- Replit: [https://metafile.saideepd.repl.co/](https://metafile.saideepd.repl.co/ "File Metadata Microservice API hosted on Replit")

### Example Usage:
- [[project url]/api/fileanalyse](https://metafile.netlify.app/api/fileanalyse)

### Example Output:
```json
{
  "name": "github_icon_grey.png",
  "type": "image/png",
  "size": 224
}
```
#### Screenshot:
![File Metadata Microservice API](https://user-images.githubusercontent.com/30663492/151174432-450feaf2-0ae3-4b7a-ab7b-6ecea119cf98.png "File Metadata Microservice API")


---
#### This project taught me the following new skills:
- Netlify Serverless Functions
- Limiting the number of requests per minute to avoid crossing any cloud service's plan limits
- Simple way to build APIs using ExpressJS
- DOM Manipulation using JavaScript
- Connecting to & using MongoDB as a database for a web app
- Using Mongoose library to interact with MongoDB
- Validating of URL using Node's inbuilt DNS library
- Using Multer library as a middleware to handle file uploads
- Storing the files to either Disk or Memory using multer
- Limiting the size of files allowed to be uploaded using multer & body-parser
- Learnt about HTML events like onload, onbeforeunload, onformchange, etc.

---
### Screenshot:

![Microservice Utility APIs Homepage](https://user-images.githubusercontent.com/30663492/151171054-e2516279-bc9e-42a7-9eeb-796133c77f4e.png "Microservice Utility APIs Homepage")