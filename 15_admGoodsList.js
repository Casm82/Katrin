"use strict";
const path = require("path");
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin/goodsList", checkAuth, (req, res) => {
    pool.query("SELECT * FROM goods_types ORDER BY id", (err, result) => {
      let rows = result?result.rows:[];
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admGoodsList", {
          "title"   : "Список товаров",
          "rows"    : rows,
          "session" : req.session,
        });
    });
  });

  app.post("/admin/getGoodsList", checkAuth, (req, res) => {
    let goodTypeId = req.body.goodTypeId?req.body.goodTypeId.toString().replace(/\D/g,""):null;
    if (goodTypeId) {
      pool.query({
        "text"   : "SELECT id,name,description,price,bulk FROM goods_list WHERE type=$1 ORDER BY id",
        "values" : [goodTypeId]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (err)
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        else
          res.render("elmAdmListGoods", {"title": "Список товаров", "rows": rows, "goodType": goodTypeId});
      });
    } else {
      res.status(500).send("Не указан id группы товаров");
    };
  });

  app.post("/admin/saveGoodsList", checkAuth, (req, res) => {
    let goodTypeId = req.body.goodTypeId;
    let goodArray = req.body.goodArray;
    async.each(goodArray, (goodObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM goods_list WHERE id=$1",
        "values" : [goodObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (goodObj.delete) {
            pool.query({
              "text"   : "DELETE FROM goods_list WHERE id=$1",
              "values" : [goodObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE goods_list SET name=$1,description=$2,bulk=$3,price=$4 WHERE id=$5",
              "values" : [goodObj.name, goodObj.description, goodObj.bulk, goodObj.price, goodObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO goods_list(type,name,description,bulk,price) VALUES ($1, $2, $3, $4, $5)",
            "values" : [goodTypeId, goodObj.name, goodObj.description, goodObj.bulk, goodObj.price]
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

  app.get("/admin/goodsPhoto/:id", checkAuth, (req, res) => {
    let commodityId = req.params.id;
    if (commodityId) {
      pool.query({
        "text"   : "SELECT id,name FROM goods_list WHERE id=$1",
        "values" : [commodityId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let commodityObj = (result.rows&&result.rows.length)?result.rows[0]:{};
          res.render("admGoodsPhoto", {
            "commodityObj" : commodityObj,
            "session"      : req.session,
          });
        };
      });
    } else {
      res.status(500).send("Не указан id мастера");
    };
  });

  app.post("/admin/goodsPhoto", checkAuth, (req, res) => {
    let commodityId = req.body.commodityId;
    let deleteId = req.body.delete;

    async.parallel([
      // записываем в базу информацию о файле
      (cbParallel) => {
        if (deleteId) fileName="blank.png";

        if (req.files&&req.files.workImg&&req.files.workImg.data) {
          let img = '\\x' + req.files.workImg.data.toString('hex');

          let photoSave = {
            "text"   : "UPDATE goods_list SET img=$1 WHERE id=$2",
            "values" : [img, commodityId]
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
        res.redirect(`/admin/goodsPhoto/${commodityId}`);
    });
  });


};
