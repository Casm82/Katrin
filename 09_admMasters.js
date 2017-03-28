"use strict";
const path = require("path");
const async = require("async");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

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
        "text"   : "SELECT id,name,photo FROM masters WHERE id=$1",
        "values" : [masterId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let masterObj = (result.rows&&result.rows.length)?result.rows[0]:{};
          res.render("admMasterPhoto", {
            "masterObj" : masterObj,
            "session"   : req.session,
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
    let fileName;
    let fileExt;
    let filePath;

    if (req.files&&req.files.workImg) {
      fileExt = req.files.workImg.mimetype.split("/")[1];
      fileName = `${masterId}.${fileExt}`;
      filePath = path.join(__dirname, "static", "images", "masters", fileName);
    };

    async.parallel([
      // сохраняем файл
      (cbParallel) => {
        if (req.files&&req.files.workImg) {
          let workImg = req.files.workImg;
          workImg.mv(filePath, (err) => { cbParallel(err); });
        } else {
          cbParallel();
        };
      },
      // записываем в базу информацию о файле
      (cbParallel) => {
        if (deleteId) fileName="blank.png";

        if (fileName) {
          let photoSave = {
            "text"   : "UPDATE masters SET photo=$1 WHERE id=$2",
            "values" : [fileName, masterId]
          };

          pool.query(photoSave, (err) => {
            if (err) { console.error(err); console.error(photoSave); };
            cbParallel(err);
          });
        } else {
          cbParallel();
        };
      }
    ], (err) => {
      if (err)
        res.status(500).send(`Произошла ошибка при сохранении: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.redirect(`/admin/masterPhoto/${masterId}`);
    });
  });

};
