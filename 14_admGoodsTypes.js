"use strict";
var async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app, pool) => {
  app.get("/admin/goodsTypes", checkAuth, (req, res) => {
    pool.query("SELECT * FROM goods_types ORDER BY id", (err, result) => {
      let rows = result?result.rows:[];
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admGoodsTypes", {
          "title"   : "Список категорий услуг",
          "rows"    : rows,
          "session" : req.session,
        });
    });
  });

  app.post("/admin/goodsTypes", checkAuth, (req, res) => {
    let typesArray = req.body.typesArray;
    async.each(typesArray, (typeObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM goods_types WHERE id=$1",
        "values" : [typeObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (typeObj.delete) {
            pool.query({
              "text"   : "DELETE FROM goods_types WHERE id=$1",
              "values" : [typeObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE goods_types SET name=$1 WHERE id=$2",
              "values" : [typeObj.name, typeObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO goods_types(name) VALUES ($1)",
            "values" : [typeObj.name]
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
