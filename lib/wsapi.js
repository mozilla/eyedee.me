const
db = require('./db.js'),
bcrypt = require('bcrypt'),
crypto = require('./crypto.js');

const BCRYPT_ROUNDS = 11;

exports.register = function(app) {
  app.get('/api/whoami', function(req, res) {
    res.json({ user: req.session.user || null });
  });

  app.get('/api/signout', function(req, res) {
    req.session.reset();
    res.writeHead(200);
    res.end();
  });

  app.post('/api/signin', function(req, res) {
    if (!req.body.user || !req.body.pass || req.body.pass.length < 6) {
      res.writeHead(400);
      return res.end();
    }

    db.getAuth(req.body.user, function(hash) {
      if (hash) {
        bcrypt.compare(req.body.pass, hash, function(err, r) {
          if (r) req.session.user = req.body.user;
          res.writeHead(!r ? 401 : 200);
          res.end();
        });
      } else {
        // add user
        bcrypt.genSalt(BCRYPT_ROUNDS, function(err, salt) {
          if (err) return cb(err);
          bcrypt.hash(req.body.pass, salt, function(err, hash) {
            if (err) return cb(err);
            db.addUser(req.body.user, hash, function(err) {
              if (!err) req.session.user = req.body.user;
              res.writeHead(err ? 401 : 200);
              res.end();
            });
          });
        });
      }
    });
  });

  app.post('/api/cert_key', function(req, res) {
    if (!req.session || !req.session.user) {
      res.writeHead(401);
      return res.end();
    }
    if (!req.body.pubkey || !req.body.duration) {
      res.writeHead(400);
      return res.end();
    }

    crypto.cert_key(
      req.body.pubkey,
      req.session.user + '@eyedee.me',
      req.body.duration,
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
