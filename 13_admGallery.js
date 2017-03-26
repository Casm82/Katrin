"use strict";

var async = require("async");
var path = require("path");

function checkAuth(req, res, next){
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/");
}

module.exports = (app, pool) => {
  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/admin/gallery/:masterId", checkAuth, (req, res) => {
    let masterId = req.params.masterId;


    async.parallel([
      // информация о мастере
      (cbParallel) => {
        let masterInfo = {
          "text"   : "SELECT * FROM masters WHERE id=$1",
          "values" : [masterId]
        };
        pool.query(masterInfo, (err, rows) => {
          cbParallel(err, (rows&&rows.length)?rows[0]:{} );
        });
      },
      // список фотографий
      (cbParallel) => {
        let galleryList = {
          "text"   : "SELECT id,fileName FROM gallery WHERE masterId=$1 ORDER BY created DESC",
          "values" : [masterId]
        };
        pool.query(galleryList, (err, rows) => { cbParallel(err, rows) });
      }
    ], (err, result) => {

      let masterObj = result[0];
      let galleryObj = result[1];
      if (err) {
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      } else {
        res.render("admGallery", {
          "title"     : "Галерея",
          "masterObj" : masterObj,
          "galleryObj": galleryObj,
          "session"   : req.session,
        });
      };
    });
  });

  app.post("/admin/gallery", checkAuth, (req, res) => {

    let currDate = new Date();
    let masterId = req.body.masterId;
    let deleteArray = [];
    let fileName;
    let fileExt;
    let filePath;

    if (req.body.delete) {
      deleteArray = Array.isArray(req.body.delete)?req.body.delete:[req.body.delete];
    };

    if (req.files&&req.files.workImg) {
      fileExt = req.files.workImg.mimetype.split("/")[1];
      fileName = `${masterId}-${currDate.getTime()}.${fileExt}`;
      filePath = path.join(__dirname, "static", "images", "gallery", fileName);
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
        if (req.files&&req.files.workImg) {
          let gallerySave = {
            "text"   : "INSERT INTO(masterId, fileName) gallery VALUES ($1, $2)",
            "values" : [masterId, fileName]
          };
          pool.query(gallerySave, (err) => { cbParallel(err) });
        } else {
          cbParallel();
        };
      } ,
      // Удаляем фотографии
      (cbParallel) => {
        if (deleteArray.length) {
          let deleteTxt = deleteArray.join(",");
          pool.query(`DELETE FROM gallery WHERE id IN (${deleteTxt})`, (err) => { cbParallel(err) });
        } else {
          cbParallel();
        };
      }
    ], (err) => {

      if (err)
        res.status(500).send(`Произошла ошибка при сохранении: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.redirect(`/admin/gallery/${masterId}`);
    });
  });
};
