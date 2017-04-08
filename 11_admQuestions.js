"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

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
      sqlQuery = "SELECT * FROM questions WHERE answered=false ORDER BY ts DESC";

    pool.query(sqlQuery, (err, result) => {
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListQuestions", { "questions" : result?result.rows:[] });
    });
  });

  app.post("/admin/saveQuestions", checkAuth, (req, res) => {
    let questionArray = req.body;

    async.each(questionArray, (questionObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM questions WHERE id=$1",
        "values" : [questionObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
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
