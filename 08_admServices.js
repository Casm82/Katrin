"use strict";
var config = require("./settings.json");
var mysql = require("mysql");
var async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app) => {
  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/admin/services", checkAuth, (req, res) => {
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    mysqlDB.query("SELECT * FROM service_type ORDER BY id", (err, rows) => {
      mysqlDB.end();
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
      let mysqlDB = mysql.createConnection(config.mysqlConfig);
      mysqlDB.query({
        "sql"    : "SELECT * FROM service_list WHERE type = ? ORDER BY id",
        "values" : [svcTypeId]
      }, (err, rows) => {
        mysqlDB.end();
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
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    async.each(svcArray, (svcObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      mysqlDB.query({
        "sql"    : "SELECT id FROM service_list WHERE id = ?",
        "values" : [svcObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (svcObj.delete) {
            mysqlDB.query({
              "sql"    : "DELETE FROM service_list WHERE id=?",
              "values" : [svcObj.id]
            }, (err) => { cbEach(err) });
          } else {
            mysqlDB.query({
              "sql"    : "UPDATE service_list SET name=?,description=?,duration=?,price=? WHERE id=?",
              "values" : [svcObj.name, svcObj.description, svcObj.duration, svcObj.price, svcObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          mysqlDB.query({
            "sql"    : "INSERT INTO service_list SET ?",
            "values" : [{
              "type"        : svcTypeId,
              "name"        : svcObj.name,
              "description" : svcObj.description,
              "duration"    : svcObj.duration,
              "price"       : svcObj.price
            }]
          }, (err) => { cbEach(err) });
        };
      });
    }, (err) => {
      mysqlDB.end();
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.status(200).send("ok");
    });
  });
};
