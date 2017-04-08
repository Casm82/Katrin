"use strict";

module.exports = (app, pool) => {
  app.get("/img/:table/:id", (req, res) => {
    let table = req.params.table;
    let rowId = req.params.id;
    let dbTable;
    switch (table) {
      case "masters": dbTable = "masters"; break;
      case "gallery": dbTable = "gallery"; break;
      case "goods"  : dbTable = "goods_list"; break;
    };
    if (dbTable&&rowId) {
      pool.query({
        "text"   : `SELECT id,img FROM ${dbTable} WHERE id=$1`,
        "values" : [rowId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let imgObj = (result.rows&&result.rows.length)?result.rows[0]:{};
          res.send(imgObj.img);
        };
      });
    } else {
      res.status(500).send("Недостаточно данных для выполнения запроса к БД");
    };
  });
};
