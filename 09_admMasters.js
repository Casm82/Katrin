"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
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
              "text"   : "UPDATE masters SET name=$1,title=$2,email=$3,notify=$4,main_page=$5,tel=$6 WHERE id=$7",
              "values" : [mstObj.name, mstObj.title, mstObj.email, mstObj.notify, mstObj.main_page, mstObj.tel, mstObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO masters(name, title, email, notify, main_page, tel) VALUES ($1, $2, $3, $4, $5)",
            "values" : [mstObj.name, mstObj.title, mstObj.email, mstObj.notify, mstObj.main_page, mstObj.tel]
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

  app.get("/admin/masterPhoto/:id", checkAuth, (req, res) => {
    let masterId = req.params.id;
    if (masterId) {
      pool.query({
        "text"   : "SELECT id,name,img FROM masters WHERE id=$1",
        "values" : [masterId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let masterObj = (result.rows&&result.rows.length)?result.rows[0]:{};
          res.render("admMasterPhoto", {
            "masterObj" : masterObj,
            "session"   : req.session
          });
        };
      });
    } else {
      res.status(500).send("Не указан id мастера");
    };
  });

  app.post("/admin/masterPhoto", checkAuth, (req, res) => {
    let masterId = req.body.masterId;
    let deleteId = req.body.delete;

    if (req.files&&req.files.workImg&&req.files.workImg.data) {
      let img = '\\x' + req.files.workImg.data.toString('hex');

      let photoSave = {
        "text"   : "UPDATE masters SET img=$1 WHERE id=$2",
        "values" : [img, masterId]
      };

      pool.query(photoSave, (err) => {
        if (err) {
          console.error(err);
          console.error(photoSave);
          res.status(500).send(`Произошла ошибка при сохранении: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          res.redirect(`/admin/masterPhoto/${masterId}`);
        };
      });

    } else {
      res.redirect(`/admin/masterPhoto/${masterId}`);
    };
  });

};
