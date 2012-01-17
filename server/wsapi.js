const db = require('./db.js');

exports.register = function(app) {
  app.get('/api/whoami', function(req, res) {
    // XXX: write me
    return res.writeHead(500);
  });

  app.get('/api/signin', function(req, res) {
    // XXX: write me
    return res.writeHead(500);
  });

  app.post('/api/cert_key', function(req, res) {
    // XXX: write me
    return res.writeHead(500);

    crypto.cert_key(
      req.body.pubkey, 'lloyd@hilaiel.com', req.body.duration,
      function(err, cert) {
        if (err) {
          res.writeHead(500);
          res.end();
        } else {
          res.json({ cert: cert });
        }
      });
  });
};
