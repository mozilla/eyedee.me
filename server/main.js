#!/usr/bin/env node

// require libraries that we depend on
const
express = require('express'),
postprocess = require('postprocess'),
url = require('url'),
path = require('path'),
crypto = require('./crypto'),
wsapi = require('./wsapi.js'),
cookieSessions = require("client-sessions");

// the key with which session cookies are encrypted
const COOKIE_SECRET = process.env.SEKRET || 'super sekret sekret';

// The IP Address to listen on.
const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1';

// The port to listen to.
const PORT = process.env.PORT || 0;

// localHostname is the address to which we bind.  It will be used
// as our external address ('audience' to which assertions will be set)
// if no 'Host' header is present on incoming login requests.
var localHostname = undefined;

// create a webserver using the express framework
var app = express.createServer();

// let's install a handler for '/__heartbeat__' which monitoring software can
// use (hit before logging)
app.use(function(req, res, next) {
  if (req.method === 'GET' && req.path === '/__heartbeat__') {
    res.writeHead(200);
    res.write('ok');
    res.end();
  } else {
    return next();
  }
});

// do some logging
app.use(express.logger({ format: 'dev' }));

// parse post bodies
app.use(express.bodyParser());

// The next three functions contain some fancy logic to make it so
// we can run multiple different versions of myfavoritebeer on the
// same server, each which uses a different browserid server
// (dev/beta/prod):
function determineEnvironment(req) {
  if (req.headers['host'] === 'eyedee.me') return 'prod';
  else if (req.headers['host'] === 'beta.eyedee.me') return 'beta';
  else if (req.headers['host'] === 'dev.eyedee.me') return 'dev';
  else return 'local';
}

function determineBrowserIDURL(req) {
  // first defer to the environment
  if (process.env.BROWSERID_URL) return process.env.BROWSERID_URL;

  return ({
    prod:   'https://browserid.org',
    beta:   'https://diresworb.org',
    dev:    'https://dev.diresworb.org',
    local:  'https://dev.diresworb.org'
  })[determineEnvironment(req)];
}

function determineBrowserIDHost(req) {
  return determineBrowserIDURL(req).replace(/http(s?):\/\//, '');
}

// encrypted cookie based session support, using
// https://github.com/benadida/node-client-sessions
app.use(cookieSessions({
  cookieName: 'eyedeeme_auth',
  secret: COOKIE_SECRET,
  cookie: { path: '/api/' }
}));

// a substitution middleware allows us to easily point at different
// browserid servers
app.use(postprocess.middleware(function(req, body) {
  var browseridURL = determineBrowserIDURL(req);
  return body.toString().replace(new RegExp("https://browserid.org", 'g'), browseridURL);
}));

// use ejs for template rendering
app.set('view engine', 'ejs');
app.register('.html', require('ejs'));
app.set("views", path.join(__dirname, "..", "views"));

// serve the "declaration of support"
app.get('/.well-known/browserid', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.render('browserid', {
    layout: false,
    pubKey: crypto.pubKey
  });
});

// serve the "provisioning page"
app.get('/browserid/provision', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.render('provision.html', {
    layout: false,
    browserid_origin: determineBrowserIDURL(req)
  });
});

// serve the "authentication page"
app.get('/browserid/sign_in', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.render('sign_in.html', { layout: false });
});

wsapi.register(app);

// Tell express from where it should serve static resources
app.use(express.static(path.join(path.dirname(__dirname), "static")));

// start listening for connections
app.listen(PORT, IP_ADDRESS, function () {
  var address = app.address();
  localHostname = address.address + ':' + address.port
  console.log("listening on " + localHostname);
});
