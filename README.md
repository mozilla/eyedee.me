EyeDee.Me
=========

EyeDee.Me is an example Indentity Provider for the BrowserID protocol. This
protocol is used by Mozilla Persona to authenticate users across the web.

EyeDee.Me styles itself like an email provider, but does not actually handle
any email. Rather, it exists solely as an example for how services, such as
email providers, can provide first-class support for BrowserID.

Setup
-----

EyeDee.Me requires Node.js, npm, a MySQL database, and a webserver acting as a
reverse proxy / SSL terminator. Once those are in place:

1.  Clone this repository.

2.  Execute `npm install` in the root of your clone to get all of the necessary
    Node libraries.

3.  Generate a signing keypair by launching `node` and running:

        jwk = require("jwcrypto/jwk");
        keypair = jwk.KeyPair.generate('RS', 128);
        console.log(keypair.publicKey.serialize());
        console.log(keypair.secretKey.serialize());

4.  Store the keys somewhere safe.

Running
-------

You must set four environment variables before EyeDee.Me will function:

1.  `PUBLIC_KEY`: The public key, as printed by the script above. Default:
    Ephemeral key, generated at runtime.

2.  `PRIVATE_KEY`: The secret key, as printed by the script above. Default:
    Ephemeral key, generated at runtime.

3.  `MYSQL_URL`: A connection string for your MySQL database, in the form
    `mysql://user:pass@host:port/dbname`. Default:
    `mysql://eyedeeme@127.0.0.1:3306/eyedeeme`

4.  `PORT`: A port for EyeDee.Me to listen on. Default: random.

Once those are available, you can run EyeDee.me with `./bin/eyedeeme` or
`npm start`.

Because the BrowserID protocol requires SSL on connections to Identity
Providers, you must also configure a reverse proxy or SSL teminator to accept
HTTPS connections and forward them to a running EyeDee.Me instance, such as
the one on the port defined above. Otherwise, your users will not be forwarded
to your Identity Provider for authentication when logging in to sites with
Persona.

