"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin/feedbacks", checkAuth, (req, res) => {
    res.render("admFeedbacks", {
      "title"   : "Отзывы о работе",
      "session" : req.session,
    });
  });

  app.post("/admin/listFeedbacks", checkAuth, (req, res) => {
    let showApproved = req.body.showApproved?req.body.showApproved:null;
    let sqlQuery;
    if (showApproved)
      sqlQuery = "SELECT * FROM feedbacks ORDER BY ts DESC";
    else
      sqlQuery = "SELECT * FROM feedbacks WHERE approved=false ORDER BY ts DESC";

    pool.query(sqlQuery, (err, result) => {
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("elmListFeedbacks", { "feedbacks" : result?result.rows:[] });
    });
  });

  app.post("/admin/saveFeedbacks", checkAuth, (req, res) => {
    let fbArray = req.body;
    async.each(fbArray, (fbObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM feedbacks WHERE id=$1",
        "values" : [fbObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (fbObj.delete) {
            pool.query({
              "text"   : "DELETE FROM feedbacks WHERE id=$1",
              "values" : [fbObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE feedbacks SET approved=$1 WHERE id=$2",
              "values" : [fbObj.approved, fbObj.id]
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
