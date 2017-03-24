"use strict";
var config = require("./settings.json");
var mysql = require("mysql");
var async = require("async");

module.exports = (app) => {
  app.get("/", (req, res) => {
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    async.parallel([
      // Получаем отзывы
      (cbParallel) => {
        let sqlQuery = "SELECT * FROM feedbacks WHERE approved=1 ORDER BY ts DESC";
        mysqlDB.query(sqlQuery, (err, rows) => {
          // Получаем три случайных отзыва
          let feedbacks = [];
          let feedbacksId = new Set();

          if (rows.length > 3) {
            while (feedbacksId.size < 3) {
              let i = Math.floor(Math.random()*rows.length);
              if (!feedbacksId.has(i)) {
                feedbacksId.add(i);
                feedbacks.push(rows[i]);
              };
            };
          } else {
            feedbacks = rows;
          };
          cbParallel(err, feedbacks);
        });
      },
      // Получаем информацию о мастерах
      (cbParallel) => {
         mysqlDB.query("SELECT * FROM masters ORDER BY id", (err, rows) => {
          cbParallel(err, rows);
         });
      }
      ], (err, result) => {
        mysqlDB.end();
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let title = "Кэтрин";
          let feedbacks = result[0];
          let masters = result[1];
          res.render("index", { title, feedbacks, masters });
        };
      }
    );
  });

  app.get("/gallery/:masterId", (req, res) => {
    let masterId = req.params.masterId;
    let mysqlDB = mysql.createConnection(config.mysqlConfig);

    async.parallel([
      // информация о мастере
      (cbParallel) => {
        let masterInfo = {
          "sql"    : "SELECT * FROM masters WHERE id=?",
          "values" : [masterId]
        };
        mysqlDB.query(masterInfo, (err, rows) => {
          cbParallel(err, (rows&&rows.length)?rows[0]:{} );
        });
      },
      // список фотографий
      (cbParallel) => {
        let galleryList = {
          "sql"    : "SELECT id,fileName FROM gallery WHERE masterId=? ORDER BY created DESC",
          "values" : [masterId]
        };
        mysqlDB.query(galleryList, (err, rows) => { cbParallel(err, rows) });
      }
    ], (err, result) => {
      mysqlDB.end();
      let masterObj = result[0];
      let galleryObj = result[1];
      if (err) {
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      } else {
        res.render("publicGallery", {
          "title"     : "Галерея",
          "masterObj" : masterObj,
          "galleryObj": galleryObj,
          "session"   : req.session,
        });
      };
    });
  });
};
