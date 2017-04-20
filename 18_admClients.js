"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin/clients", checkAuth, (req, res) => {
    pool.query("SELECT * FROM clients ORDER BY id", (err, result) => {
      let rows = result?result.rows:[];
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.render("admClients", {
          "title"   : "Список клиентов",
          "rows"    : rows,
          "session" : req.session,
        });
    });
  });

  app.post("/admin/clients", checkAuth, (req, res) => {
    let clientsArray = req.body;
    async.each(clientsArray, (clientObj, cbEach) => {
      // Определяем запись новая или уже есть в БД
      pool.query({
        "text"   : "SELECT id FROM clients WHERE id=$1",
        "values" : [clientObj.id]
      }, (err, result) => {
        let rows = result?result.rows:[];
        if (rows&&rows.length) {
          // есть в БД - обновляем или удаляем
          if (clientObj.delete) {
            pool.query({
              "text"   : "DELETE FROM clients WHERE id=$1",
              "values" : [clientObj.id]
            }, (err) => { cbEach(err) });
          } else {
            pool.query({
              "text"   : "UPDATE clients SET name=$1,email=$2,tel=$3 WHERE id=$4",
              "values" : [clientObj.name, clientObj.email, clientObj.tel, clientObj.id]
            }, (err) => { cbEach(err) });
          };
        } else {
          // новая - вставляем
          pool.query({
            "text"   : "INSERT INTO clients(name, email, tel) VALUES ($1,$2,$3)",
            "values" : [clientObj.name, clientObj.email, clientObj.tel]
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
};
