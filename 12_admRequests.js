"use strict";

var pg = require("pg");
var async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app, pool) => {
  app.get("/admin/requests", checkAuth, (req, res) => {
    res.render("admRequests", {
      "title"   : "Управление заявками",
      "session" : req.session,
    });
  });

  app.post("/admin/listRequests", checkAuth, (req, res) => {
    let showCompleted = req.body.showCompleted?req.body.showCompleted:null;


    let sqlQuery;
    if (showCompleted)
      sqlQuery = "SELECT * FROM requests ORDER BY selectedDate";
    else
      sqlQuery = "SELECT * FROM requests WHERE completed=0 ORDER BY selectedDate";

    pool.query(sqlQuery, (err, rows) => {

      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListRequests", { "requests" : rows });
    });
  });

  app.post("/admin/saveRequests", checkAuth, (req, res) => {
    let requestArray = req.body;

    async.each(requestArray, (questionObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM requests WHERE id=$1",
        "values" : [questionObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (questionObj.delete) {
            pool.query({
              "text"   : "DELETE FROM requests WHERE id=$1",
              "values" : [questionObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE requests SET completed=$1 WHERE id=$2",
              "values" : [questionObj.completed, questionObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // неизвестный id - пропускаем
          cbEach(err);
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
