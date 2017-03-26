"use strict";
var config = require("./settings.json");
var pg = require("pg");
var async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app, pool) => {

  app.get("/admin/questions", checkAuth, (req, res) => {
    res.render("admQuestions", {
      "title"   : "Вопросы",
      "session" : req.session,
    });
  });

  app.post("/admin/listQuestions", checkAuth, (req, res) => {
    let showAnswered = req.body.showAnswered?req.body.showAnswered:null;


    let sqlQuery;
    if (showAnswered)
      sqlQuery = "SELECT * FROM questions ORDER BY ts DESC";
    else
      sqlQuery = "SELECT * FROM questions WHERE answered=0 ORDER BY ts DESC";

    pool.query(sqlQuery, (err, rows) => {

      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListQuestions", { "questions" : rows });
    });
  });

  app.post("/admin/saveQuestions", checkAuth, (req, res) => {
    let questionArray = req.body;

    async.each(questionArray, (questionObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM questions WHERE id=$1",
        "values" : [questionObj.id]
      }, (err, rows) => {
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (questionObj.delete) {
            pool.query({
              "text"   : "DELETE FROM questions WHERE id=$1",
              "values" : [questionObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE questions SET answered=$1 WHERE id=$2",
              "values" : [questionObj.answered, questionObj.id]
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
