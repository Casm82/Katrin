"use strict";
const async = require("async");
const path = require("path");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin/gallery/:masterId", checkAuth, (req, res) => {
    let masterId = req.params.masterId;
    async.parallel([
      // информация о мастере
      (cbParallel) => {
        let masterInfo = {
          "text"   : "SELECT id,name FROM masters WHERE id=$1",
          "values" : [masterId]
        };
        pool.query(masterInfo, (err, result) => {
          let rows = result?result.rows:[];
          cbParallel(err, (rows&&rows.length)?rows[0]:{} );
        });
      },
      // список фотографий
      (cbParallel) => {
        let galleryList = {
          "text"   : "SELECT id FROM gallery WHERE masterId=$1 ORDER BY created DESC",
          "values" : [masterId]
        };
        pool.query(galleryList, (err, result) => { cbParallel(err, result?result.rows:[]) });
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

    if (req.body.delete) {
      deleteArray = Array.isArray(req.body.delete)?req.body.delete:[req.body.delete];
    };

    async.parallel([
      // записываем в базу информацию о файле
      (cbParallel) => {
        if (req.files&&req.files.workImg&&req.files.workImg.data) {
          let img = '\\x' + req.files.workImg.data.toString('hex');

          let gallerySave = {
            "text"   : "INSERT INTO gallery(masterid, img, created) VALUES ($1, $2, $3)",
            "values" : [masterId, img, new Date()]
          };
          pool.query(gallerySave, (err) => {
            if (err) { console.error(err); console.error(gallerySave); };
            cbParallel(err);
          });
        } else {
          cbParallel();
        };
      } ,
      // Удаляем фотографии
      (cbParallel) => {
        if (deleteArray.length) {
          let deleteTxt = deleteArray.join(",");
          let deleteQuery = `DELETE FROM gallery WHERE id IN (${deleteTxt})`;
          pool.query(deleteQuery, (err) => {
            if (err) { console.error(err); console.error(deleteQuery); };
            cbParallel(err)
          });
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
