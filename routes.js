"use strict";

const pg = require("pg");
const Pool = require("pg-pool");
const url = require("url")

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

const pool = new Pool(config);

pool.on('error', function(error, client) {
  console.error(error);
});


/*pool.on('connect', client => {
  console.log("connected to db");
})
*/

module.exports = (app) => {
  require("./01_index")(app, pool);
  require("./02_enrollment")(app, pool);
  require("./03_shop")(app, pool);
  require("./04_price")(app, pool);
  require("./05_feedback")(app, pool);
  require("./06_question")(app, pool);
  require("./07_admin")(app, pool);
  require("./08_admServices")(app, pool);
  require("./09_admMasters")(app, pool);
  require("./10_admFeedback")(app, pool);
  require("./11_admQuestions")(app, pool);
  require("./12_admRequests")(app, pool);
  require("./13_admGallery")(app, pool);
};
