"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin/serviceType", checkAuth, (req, res) => {
    pool.query("SELECT * FROM service_type ORDER BY id", (err, result) => {
      let rows = result?result.rows:[];
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admServiceTypes", {
          "title"   : "Список категорий услуг",
          "rows"    : rows,
          "session" : req.session,
        });
    });
  });

  app.post("/admin/serviceType", checkAuth, (req, res) => {
    let typesArray = req.body.typesArray;
    async.each(typesArray, (typeObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM service_type WHERE id=$1",
        "values" : [typeObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (typeObj.delete) {
            pool.query({
              "text"   : "DELETE FROM service_type WHERE id=$1",
              "values" : [typeObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE service_type SET name=$1 WHERE id=$2",
              "values" : [typeObj.name, typeObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO service_type(name) VALUES ($1)",
            "values" : [typeObj.name]
          }, (err) => { cbEach(err) });
        };
      });
    }, (err) => {
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.status(200).send("ok");
    });
  });
};
