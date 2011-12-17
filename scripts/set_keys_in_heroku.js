#!/usr/bin/env node

const
jwk = require('jwcrypto/jwk'),
child_process = require('child_process'); 

// generate a 2048 bit RSA key
var keypair = jwk.KeyPair.generate('RS', 128);

// set the heroku PUBLIC_KEY param
child_process.exec(
  "heroku config:add PUBLIC_KEY='" + keypair.publicKey.serialize() + "'",
  function(err, r) {
    if (err) throw "can't set public key";
    console.log("public key set");
    child_process.exec(
      "heroku config:add PRIVATE_KEY='" + keypair.secretKey.serialize() + "'",
      function(err, r) {
        if (err) throw "can't set private key";
        console.log("private key set");
      });
  });
