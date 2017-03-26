"use strict";
var config = require("./settings.json");

function queryDB (title, typeId, res) {

  pool.query({
    "text"    : "SELECT name, description, price FROM service_list WHERE type=$1 ORDER BY id",
    "values" : [typeId]
  }, (err, rows) => {

    if (err)
      res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
    else
      res.render("service", { title, rows });
  });
};

module.exports = (app, pool) => {
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
