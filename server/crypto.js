const jwk = require("jwcrypto/jwk");

exports.pubKey = JSON.parse(process.env['PUBLIC_KEY']);
exports.privKey = JSON.parse(process.env['PRIVATE_KEY']);

if (!exports.pubKey) {
  if (exports.pubKey != exports.privKey) {
    throw "inconsistent configuration!  if privKey is defined, so must be pubKey";
  } 
  // if no keys are provided emit a nasty message and generate some
  console.log("WARNING: you're using ephemeral keys.  They will be purged at restart.");

  // generate a fresh 1024 bit RSA key
  var keypair = jwk.KeyPair.generate('RS', 128);

  exports.pubKey = JSON.parse(keypair.publicKey.serialize());
  exports.privKey = JSON.parse(keypair.secretKey.serialize());
} 
