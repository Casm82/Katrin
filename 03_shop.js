"use strict";

module.exports = (app, pool) => {
  app.get("/shop/:id", (req, res) => {
    let goodTypeId = req.params.id;
    if (goodTypeId) {
      pool.query({
        "text"   : "SELECT id,name,description,price,bulk FROM goods_list WHERE type=$1 ORDER BY id",
        "values" : [goodTypeId]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (err)
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        else
          res.render("elmListGoods", {"title": "Список товаров", "rows": rows});
      });
    } else {
      res.status(500).send("Не указан id группы товаров");
    };
  });
};
