"use strict";
const async = require("async");

module.exports = (app, pool) => {
  app.get("/", (req, res) => {
    async.parallel([
      // Получаем отзывы
      (cbParallel) => {
        let sqlQuery = "SELECT * FROM feedbacks WHERE approved=TRUE ORDER BY ts DESC";
        pool.query(sqlQuery, (err, result) => {
          // Получаем три случайных отзыва
          let feedbacks = [];
          let feedbacksId = new Set();
          let rows = result?result.rows:[];

          if (rows&&rows.length > 3) {
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
         pool.query("SELECT * FROM masters WHERE main_page=true ORDER BY id", (err, result) => {
          cbParallel(err, result?result.rows:[]);
         });
      },
      // Получаем информацию о работах
      (cbParallel) => {
         pool.query("SELECT masterid,count(id) FROM gallery GROUP BY masterid;", (err, result) => {
          cbParallel(err, result?result.rows:[]);
         });
      },
      // Получаем информацию о категориях товаров
      (cbParallel) => {
         pool.query("SELECT * FROM goods_types ORDER BY id", (err, result) => {
          cbParallel(err, result?result.rows:[]);
         });
      },
      // Получаем информацию о товаров
      (cbParallel) => {
        pool.query("SELECT id,name,type FROM goods_list", (err, result) => {
          cbParallel(err, result?result.rows:[]);
        });
      },
      // Получаем информацию о списках услуг
      (cbParallel) => {
        pool.query("SELECT * FROM service_type", (err, result) => {
          cbParallel(err, result?result.rows:[]);
        });
      }
      ], (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let title = "Кэтрин";
          let feedbacks   = result[0];
          let masters     = result[1];
          let galleryImgs = result[2];
          let goodsType   = result[3];
          let serviceType = result[4];

          let imgsCount = {};
          galleryImgs.forEach((row) => { imgsCount[row.masterid] = Number(row.count) });
          res.render("index", { title, feedbacks, masters, imgsCount, goodsType, serviceType });
        };
      }
    );
  });

  app.get("/gallery/:masterId", (req, res) => {
    let masterId = req.params.masterId;
    async.parallel([
      // информация о мастере
      (cbParallel) => {
        let masterInfo = {
          "text"   : "SELECT * FROM masters WHERE id=$1",
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
          "text"   : "SELECT id FROM gallery WHERE masterid=$1 ORDER BY created DESC",
          "values" : [masterId]
        };
        pool.query(galleryList, (err, result) => { cbParallel(err, result?result.rows:[]) });
      }
    ], (err, result) => {

      let masterObj  = result[0];
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
