"use strict";
const async = require("async");
const checkAuth = require("./checkAuth");

module.exports = (app, pool) => {
  app.get("/admin", (req, res) => {
    if (req.session && req.session.user) {
      async.parallel([
        // Список заявок
        (cbParallel) => {
          pool.query("SELECT * FROM requests WHERE completed=false ORDER BY selectedDate",
          (err, result) => {
            cbParallel(err, result?result.rows:[]);
          });
        },
        // Список отзывов
        (cbParallel) => {
          pool.query("SELECT * FROM feedbacks WHERE approved=false ORDER BY ts DESC",
          (err, result) => {
            cbParallel(err, result?result.rows:[]);
          });
        },
        // Список неотвеченных вопросов
        (cbParallel) => {
          pool.query("SELECT * FROM questions WHERE answered=false ORDER BY ts DESC",
          (err, result) => {
            cbParallel(err, result?result.rows:[]);
          });
        }
      ], (err, result) => {

        if (err)
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        else
          res.render("admin", {
            "title"     : "Администрирование",
            "session"   : req.session,
            "requests"  : result[0],
            "feedbacks" : result[1],
            "questions" : result[2]
          });
      });
    } else {
      res.render("login", { title: "Вход", session: req.session });
    };
  });

  //////////////////////////////////////////////////////////////////////////////////////////
  app.post("/session", (req, res) => {
    var login = req.body.username.toString();
    var pwd = req.body.password.toString();
    if ((login==process.env.KATRIN_ADMIN_LOGIN)&&(pwd==process.env.KATRIN_ADMIN_PWD)) {
      // прошёл аутентификацию
      req.session.user = login;
      res.redirect("/admin");
    } else {
      // не прошёл аутентификацию
      req.session.user = null;
      req.session.destroy();
      res.render("authError");
    };
  });

  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/logout", checkAuth, (req, res) => {
    if (req.session.user) {
      req.session.destroy();
      res.redirect("/");
    }
  });
};
