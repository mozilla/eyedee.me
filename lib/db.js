const
mysql = require('mysql'),
url = require('url');

var _client;

var
db_host = exports.db_host = '127.0.0.1',
db_port = 3306,
db_user = 'eyedeeme',
db_pass = undefined,
db_name = 'eyedeeme';

if (process.env['MYSQL_URL']) {
  var u = url.parse(process.env['MYSQL_URL']);
  db_host = u.hostName;
  db_port = u.port || db_port;
  db_user = u.auth.split(':')[0];
  db_pass = u.auth.split(':')[1];
  db_name = u.path.substr(1);
}

console.log("Using mysql server at: " + db_host + ":" + db_port + " as '" +
            db_user + "' " + (db_pass ? "(with password) " : "") + "db:" + db_name);


exports.connect = function(cb) {
  // otherwise connect
  const sql =
    "CREATE TABLE IF NOT EXISTS user (" +
    "who CHAR(48) PRIMARY KEY NOT NULL," +
    "hash CHAR(64)" +
    ") ENGINE=MyISAM;";

  var options = {
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_pass,
    database: db_name
  };

  client = mysql.createClient(options);

  client.query(sql, cb);
};

exports.getAuth = function(user, cb) {
  client.query(
    'SELECT hash FROM user WHERE who = ?', [ user.toLowerCase() ], function (err, r) {
      if (err) return cb();
      cb((r && r.length == 1) ? r[0].hash : null);
    });
};

exports.addUser = function(user, hash, cb) {
  // add that user!
  client.query('INSERT INTO user(who, hash) VALUES(?,?)', [user.toLowerCase(), hash], cb);
};
