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
  app.get("/admin/requests", checkAuth, (req, res) => {
    res.render("admRequests", {
      "title"   : "Управление заявками",
      "session" : req.session,
    });
  });
  
  app.post("/admin/listRequests", checkAuth, (req, res) => {
    let showCompleted = req.body.showCompleted?req.body.showCompleted:null;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    
    let sqlQuery;
    if (showCompleted)
      sqlQuery = "SELECT * FROM requests ORDER BY selectedDate";
    else
      sqlQuery = "SELECT * FROM requests WHERE completed=0 ORDER BY selectedDate";
    
    mysqlDB.query(sqlQuery, (err, rows) => {
      mysqlDB.end();
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListRequests", { "requests" : rows });
    });
  });
  
  app.post("/admin/saveRequests", checkAuth, (req, res) => {
    let requestArray = req.body;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    async.each(requestArray, (questionObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      mysqlDB.query({
        "sql"    : "SELECT id FROM requests WHERE id = ?",
        "values" : [questionObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (questionObj.delete) {
            mysqlDB.query({
              "sql"    : "DELETE FROM requests WHERE id=?",
              "values" : [questionObj.id]
            }, (err) => { cbEach(err) });
          } else {
            mysqlDB.query({
              "sql"    : "UPDATE requests SET completed=? WHERE id=?",
              "values" : [questionObj.completed, questionObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // неизвестный id - пропускаем
          cbEach(err);
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
