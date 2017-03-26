"use strict";

var async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app, pool) => {
  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/admin/services", checkAuth, (req, res) => {
    pool.query("SELECT * FROM service_type ORDER BY id", (err, result) => {
      let rows = result?result.rows:[];
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admServices", {
          "title"   : "Список услуг",
          "rows"    : rows,
          "session" : req.session,
        });
    });
  });

  app.post("/admin/listServices", checkAuth, (req, res) => {
    let svcTypeId = req.body.svcTypeId?req.body.svcTypeId.toString().replace(/\D/g,""):null;
    if (svcTypeId) {
      pool.query({
        "text"   : "SELECT * FROM service_list WHERE type = $1 ORDER BY id",
        "values" : [svcTypeId]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (err)
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        else
          res.render("elmListServices", { "title": "Список услуг", "rows": rows, "svcType": svcTypeId });
      });
    } else {
      res.status(500).send("Не указан id сервиса");
    };
  });

  app.post("/admin/saveServices", checkAuth, (req, res) => {
    let svcTypeId = req.body.svcTypeId;
    let svcArray = req.body.svcArray;
    async.each(svcArray, (svcObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM service_list WHERE id=$1",
        "values" : [svcObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (svcObj.delete) {
            pool.query({
              "text"   : "DELETE FROM service_list WHERE id=$1",
              "values" : [svcObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE service_list SET name=$1,description=$2,duration=$3,price=$4 WHERE id=$5",
              "values" : [svcObj.name, svcObj.description, svcObj.duration, svcObj.price, svcObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO service_list(type,name,description,duration,price) VALUES ($1, $2, $3, $4, $5)",
            "values" : [svcTypeId, svcObj.name, svcObj.description, svcObj.duration, svcObj.price]
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
