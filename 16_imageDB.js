"use strict";

module.exports = (app, pool) => {
  app.get("/img/:table/:id", (req, res) => {
    let table = req.params.table;
    let rowId = req.params.id;
    if (rowId) {
      pool.query({
        "text"   : "SELECT id,img FROM masters WHERE id=$1",
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
      res.status(500).send("Не указан id строки");
    };
  });
};
