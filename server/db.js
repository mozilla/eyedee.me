var _client;

var
db_host = exports.db_host = '127.0.0.1',
db_port = 3306,
db_user = 'eydeeme';
db_pass = undefined;
db_name = 'eyedeeme';

if (process.env['MYSQL_URL']) {
  var u = url.parse(process.env['MYSQL_URL']);
  db_host = u.host;
  db_port = u.port || db_port;
  db_user = u.auth.split(':')[0];
  db_pass = u.auth.split(':')[1];
  database = u.path.substr(1);
}

console.log("Using mysql server at: " + db_host + ":" + db_port + " as '" +
            db_user + "' " + (db_pass ? "(with password) " : "") + "db:" + db_name);


exports.connect = function(cb) {
  // otherwise connect
  const sql =
    "CREATE TABLE IF NOT EXISTS " + db_name + " (" +
    "who CHAR(48) PRIMARY KEY NOT NULL," +
    "passwd CHAR(64)" +
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

exports.auth = function(user, pass, cb) {
  // XXX: write me
  process.nextTick(function() { cb("not implemented") });
};
