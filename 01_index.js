"use strict";
var config = require("./settings.json");
var mysql = require("mysql");

module.exports = (app) => {
  app.get("/", (req, res) => {
    let mysqlDB = mysql.createConnection(config.mysqlConfig);
    let sqlQuery = "SELECT * FROM feedbacks WHERE approved=1 ORDER BY ts DESC";    
    mysqlDB.query(sqlQuery, (err, rows) => {
      mysqlDB.end();
      if (err) {
        res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
      } else {
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
        res.render("index", { "title": "Кэтрин", "feedbacks" : feedbacks });
      };
    });
  });};
