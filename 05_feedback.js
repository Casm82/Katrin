"use strict";
var config = require("./settings.json");

module.exports = (app, pool) => {
  app.post("/feedback", (req, res) => {
    let feedback = req.body;
    let name = req.body.name?req.body.name.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let email = req.body.email?req.body.email.replace(/[^a-zA-Z@_0-9\-\.]/g,""):null;
    let tel = req.body.tel?req.body.tel.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let title = req.body.title?req.body.title.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let message = req.body.message?req.body.message.replace(/[^a-zA-Zа-яА-Я0-9 .,]/g,""):null;



    pool.query({
      "text"    : "INSERT INTO (name, email, tel, title, message) feedbacks VALUES ($1, $2, $3, $4, $5)",
      "values" : [{ name, email, tel, title, message }]
      },
    (err) => {

      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.status(200).send("ok");
    });
  });
};
