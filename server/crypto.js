const
jwk = require("jwcrypto/jwk"),
jwcert = require("jwcrypto/jwcert");

try {
  exports.pubKey = JSON.parse(process.env['PUBLIC_KEY']);
  _privKey = JSON.parse(process.env['PRIVATE_KEY']);
} catch(e) { }

if (!exports.pubKey) {
  if (exports.pubKey != exports.privKey) {
    throw "inconsistent configuration!  if privKey is defined, so must be pubKey";
  }
  // if no keys are provided emit a nasty message and generate some
  console.log("WARNING: you're using ephemeral keys.  They will be purged at restart.");

  // generate a fresh 1024 bit RSA key
  var keypair = jwk.KeyPair.generate('RS', 128);

  exports.pubKey = JSON.parse(keypair.publicKey.serialize());
  _privKey = JSON.parse(keypair.secretKey.serialize());
}

// turn _privKey into an instance
var _privKey = jwk.SecretKey.fromSimpleObject(_privKey);

exports.cert_key = function(pubkey, email, duration_s, cb) {
  var expiration = new Date();
  var pubkey = jwk.PublicKey.fromSimpleObject(pubkey);
  expiration.setTime(new Date().valueOf() + duration_s * 1000);
  process.nextTick(function() {
    cb(null, (new jwcert.JWCert('eyedee.me', expiration, new Date(),
                                pubkey, {email: email})).sign(_privKey));
  });
};