const http = require('http');
const { url } = require('inspector');
const { runInNewContext } = require('vm');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here

    // Parsing the substrings
    const urlSubStr = req.url.split('/'); // Splits url into Substrings
    let requestedDogId = parseint(req.url.split('/')[2] ? req.url.split('/')[2] : undefined)

    if (req.method === 'GET') {

        //Root Page Route Handler
      if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.Header = ('Content-Type', 'text/plain')

        return res.end('Dog Club')
      }


    if (urlSubStr.length >= 2) {
      
      // Route Handler for the Dogs Page
      if (req.url === '/dogs') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Dogs Index');
      }

      // Route Handler for Dog Creation  Page
      if (url.urlSubStr[2] === 'new') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Dog create form page')
      }

      // Route Handler for dog details using dogID
      if (req.url === `/dogs/${requestedDogId}`) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog details for dogId: ${requestedDogId}`)
      }
      
      if (req.url === `/dogs/${requestedDogId}/edit`) {
        statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog edit form page for dogid: ${requestedDogId}`)
      }
    }
  }

    // Post Method Handlers Group
    if (req.method === 'POST') {

      if (req.url === '/dogs') {
        statusCode = 302;
        res.setHeader('Location',`/dogs/${getNewDogId()}`);
        return res.end()
      }

      if (url.urlSubStr[2] === `${requestedDogId}`) {
        statusCode = 302;
        res.setHeader('Location', `/dogs/${requestedDogId}`);
        return res.end()
      }
    }

    

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));