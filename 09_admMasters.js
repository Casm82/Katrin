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
  app.get("/admin/masters", checkAuth, (req, res) => {
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    mysqlDB.query("SELECT * FROM masters ORDER BY id", (err, rows) => {
      mysqlDB.end();
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admMasters", {
          "title"   : "Мастера",
          "rows"    : rows,
          "session" : req.session,
        });
    }); 
  });
  
  app.post("/admin/saveMasters", checkAuth, (req, res) => {
    let mstArray = req.body;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    async.each(mstArray, (mstObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      mysqlDB.query({
        "sql"    : "SELECT id FROM masters WHERE id = ?",
        "values" : [mstObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (mstObj.delete) {
            mysqlDB.query({
              "sql"    : "DELETE FROM masters WHERE id=?",
              "values" : [mstObj.id]
            }, (err) => { cbEach(err) });
          } else {
            mysqlDB.query({
              "sql"    : "UPDATE masters SET name=?,title=?,email=?,notify=?,tel=? WHERE id=?",
              "values" : [mstObj.name, mstObj.title, mstObj.email, mstObj.notify, mstObj.tel, mstObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          mysqlDB.query({
            "sql"    : "INSERT INTO masters SET ?",
            "values" : [{
              "name"   : mstObj.name,
              "title"  : mstObj.title,
              "email"  : mstObj.email,
              "notify" : mstObj.notify,
              "tel"    : mstObj.tel
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
