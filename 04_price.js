"use strict";
var config = require("./settings.json");
var mysql = require("mysql");

function queryDB (title, typeId, res) {
  let mysqlDB = mysql.createConnection(config.mysqlConfig);
  mysqlDB.query({
    "sql"    : "SELECT name, description, price FROM service_list WHERE type = ? ORDER BY id",
    "values" : [typeId]
  }, (err, rows) => {
    mysqlDB.end();
    if (err)
      res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
    else
      res.render("service", { title, rows });
  });  
};

module.exports = (app) => {
  app.get("/price/face", (req, res) => {
    queryDB("Уход за лицом", 1, res);
  });

  app.get("/price/hair", (req, res) => {
    queryDB("Парикмахерские услуги", 2, res);
  });

  app.get("/price/nails", (req, res) => {
    queryDB("Уход за ногтями", 3, res);
  });
};
