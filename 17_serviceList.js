"use strict";

module.exports = (app, pool) => {
  // Страница выбора услуги
  app.get("/serviceList", (req, res) => {
    let title = "Персональные услуги";
    pool.query("SELECT * FROM service_type", (err, result) => {
      if (err) {
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      } else {
        let rows = result?result.rows:[];
        res.render("serviceList", { title, rows });
      };
    });
  });

  // Загружает список услуг
  app.post("/serviceList", (req, res) => {
    let serviceType = req.body.serviceType?Number(req.body.serviceType.toString().replace(/\D/g,"")):null;
    if (serviceType) {
    let sqlQuery = {
      "text"   : "SELECT id,type,name,duration,price FROM service_list WHERE type=$1",
      "values" : [serviceType]
    };
    pool.query(sqlQuery, (err, result) => {
      if (err) {
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      } else {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          let servicesObj = {};
          rows.forEach((row) => {
            let serviceDesc = {"id": row.id, "name": row.name, "duration": row.duration, "price": row.price};
            if (!servicesObj[row.type])
              servicesObj[row.type] = [serviceDesc];
            else
              servicesObj[row.type].push(serviceDesc);
          });
          res.render("elmPublicListServices", { servicesObj });
        };
      };
    });
    } else {
      res.status(500).send("Не указан идентификатор группы услуг");
    };
  });
};
