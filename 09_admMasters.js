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
  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/admin/masters", checkAuth, (req, res) => {
    pool.query("SELECT * FROM masters ORDER BY id", (err, result) => {
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admMasters", {
          "title"   : "Мастера",
          "rows"    : result?result.rows:[],
          "session" : req.session,
        });
    });
  });

  app.post("/admin/saveMasters", checkAuth, (req, res) => {
    let mstArray = req.body;
    async.each(mstArray, (mstObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM masters WHERE id=$1",
        "values" : [mstObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (mstObj.delete) {
            pool.query({
              "text"   : "DELETE FROM masters WHERE id=$1",
              "values" : [mstObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE masters SET name=$1,title=$2,email=$3,notify=$4,tel=$5 WHERE id=$6",
              "values" : [mstObj.name, mstObj.title, mstObj.email, mstObj.notify, mstObj.tel, mstObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO masters(name, title, email, notify, tel) VALUES ($1, $2, $3, $4, $5)",
            "values" : [mstObj.name, mstObj.title, mstObj.email, mstObj.notify, mstObj.tel]
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
