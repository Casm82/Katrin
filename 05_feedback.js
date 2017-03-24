"use strict";
var config = require("./settings.json");
var mysql = require("mysql");

module.exports = (app) => {
  app.post("/feedback", (req, res) => {
    let feedback = req.body;
    let name = req.body.name?req.body.name.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let email = req.body.email?req.body.email.replace(/[^a-zA-Z@_0-9\-\.]/g,""):null;
    let tel = req.body.tel?req.body.tel.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let title = req.body.title?req.body.title.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let message = req.body.message?req.body.message.replace(/[^a-zA-Zа-яА-Я0-9 .,]/g,""):null;
    
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    
    mysqlDB.query({
      "sql"    : "INSERT INTO feedbacks SET ?",
      "values" : [{ name, email, tel, title, message }]
      },
    (err) => {
      mysqlDB.end();
      if (err)
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      else
        res.status(200).send("ok");
    });
  });
};
