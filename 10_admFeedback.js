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
  
  app.get("/admin/feedbacks", checkAuth, (req, res) => {
    res.render("admFeedbacks", {
      "title"   : "Отзывы о работе",
      "session" : req.session,
    });
  });
  
  app.post("/admin/listFeedbacks", checkAuth, (req, res) => {
    let showApproved = req.body.showApproved?req.body.showApproved:null;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    
    let sqlQuery;
    if (showApproved)
      sqlQuery = "SELECT * FROM feedbacks ORDER BY ts DESC";
    else
      sqlQuery = "SELECT * FROM feedbacks WHERE approved=0 ORDER BY ts DESC";
    
    mysqlDB.query(sqlQuery, (err, rows) => {
      mysqlDB.end();
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListFeedbacks", { "feedbacks" : rows });
    });
  });
  
  app.post("/admin/saveFeedbacks", checkAuth, (req, res) => {
    let fbArray = req.body;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    async.each(fbArray, (fbObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      mysqlDB.query({
        "sql"    : "SELECT id FROM feedbacks WHERE id = ?",
        "values" : [fbObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (fbObj.delete) {
            mysqlDB.query({
              "sql"    : "DELETE FROM feedbacks WHERE id=?",
              "values" : [fbObj.id]
            }, (err) => { cbEach(err) });
          } else {
            mysqlDB.query({
              "sql"    : "UPDATE feedbacks SET approved=? WHERE id=?",
              "values" : [fbObj.approved, fbObj.id]
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
