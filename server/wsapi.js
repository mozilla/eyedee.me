const db = require('./db.js');

exports.register = function(app) {
  app.get('/api/whoami', function(req, res) {
    res.json({ user: req.session.user || null });
  });

  app.post('/api/signin', function(req, res) {
    if (!req.body.user || !req.body.pass || req.body.pass.length < 6) {
      res.writeHead(400);
      return res.end();
    }
    db.auth(req.body.user, req.body.pass, function(err) {
      res.writeHead(err ? 401 : 200);
      res.end();
    });
  });

  app.post('/api/cert_key', function(req, res) {
    // XXX: write me
    res.writeHead(500);
    return res.end();

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
