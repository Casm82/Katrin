"use strict";
const async = require("async");
const nodemailer = require("nodemailer");

module.exports = (app, pool) => {
  app.get("/enrollment", (req, res) => {
    let title = "Персональные услуги";
    pool.query("SELECT id,type,name,duration,price FROM service_list ORDER BY type,id", (err, result) => {
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
          res.render("enrollService", { title, servicesObj });
        };
      };
    });
  });

  app.get("/enrollment/:serviceId", (req, res) => {
    let title = "Выбор даты";
    let serviceId = req.params.serviceId?req.params.serviceId.toString().replace(/\D/g,""):null;

    if (serviceId) {
      pool.query({
        "text"   : "SELECT id,name,duration,price FROM service_list WHERE id=$1",
        "values" : [serviceId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let rows = result?result.rows:[];
          let serviceObj = (rows&&rows.length)?rows[0]:{}; // выбранная услуга
          // Календарь
          let curDate = new Date(); // текущая дата и дата в прошлом месяце
          let prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());

          let leapYear = curDate.getFullYear()%4?false:true;  // високосный год
          // массив кол-ва дней в месяцах и названия месяцев
          let daysInMonth = [31, leapYear?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          let monthArray = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

          // текущий день и месяц
          let dayNow = curDate.getDate(); // текущий день месяца
          let curDoW = curDate.getDay();  // текущий день недели
          let monthNum = curDate.getMonth();
          let monthTxt = monthArray[curDate.getMonth()];

          let maxDaysCurr = daysInMonth[curDate.getMonth()];  // кол-во дней в текущем месяце
          let maxDaysPrev = daysInMonth[prevDate.getMonth()]; // кол-во дней в прошлом месяце

          // Определяем день недели первого числа месяца
          let firstDoW = new Date(curDate.getFullYear(), curDate.getMonth(), 1).getDay();
          if (firstDoW==0) firstDoW=7;
          let calGrid = [];
          let dayNum=1;
          for (let n=1; n<42; n++) {
            if (n < firstDoW) calGrid.push({"n": maxDaysPrev-firstDoW+n+1, "curMonth": false});
            if (n >= firstDoW) {
              let calDay = dayNum++%maxDaysCurr; // 0,1,..31
              let wrapDay = calDay?calDay:maxDaysCurr;  // 1,2,...31
              calGrid.push({"n": wrapDay, "curMonth": wrapDay>=dayNow});
            };
          };
          res.render("enrollDate", { title, serviceObj, calGrid, dayNow, monthNum, monthTxt });
        };
      });
    } else {
      res.status(500).send("Не указан идентификатор услуги");
    };
  });

  app.get("/enrollment/:serviceId/:selectedDate", (req, res) => {
    let title = "Контактные данные";
    let serviceId = req.params.serviceId?req.params.serviceId.toString().replace(/\D/g,""):null;
    let selectedDate = req.params.selectedDate?Number(req.params.selectedDate.toString().replace(/\D/g,"")):null;

    if (serviceId) {
      pool.query({
        "text"   : "SELECT id,name,duration,price FROM service_list WHERE id=$1",
        "values" : [serviceId]
      }, (err, result) => {
        if (err) {
          res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
        } else {
          let rows = result?result.rows:[];
          let serviceObj = (rows&&rows.length)?rows[0]:{}; // выбранная услуга
          res.render("enrollPerson", { title, serviceObj, selectedDate } );
        };
      });
    } else {
      res.status(500).send("Не указан идентификатор услуги");
    };
  });

  app.post("/register", (req, res) => {
    let registerObj = req.body;
    let name = req.body.name?req.body.name.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let email = req.body.email?req.body.email.replace(/[^a-zA-Z@_0-9\-\.]/g,""):null;
    let tel = req.body.tel?req.body.tel.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):"не указан";
    let message = req.body.message?req.body.message.replace(/[^a-zA-Zа-яА-Я0-9 .,]/g,""):null;
    let serviceId = req.body.serviceId?req.body.serviceId.replace(/\D/g,""):null;
    let selectedDate = (req.body.selectedDate&&req.body.selectedDate.replace(/\D/g,""))?new Date(Number(req.body.selectedDate.replace(/\D/g,""))):new Date();
    let regDate = new Date();

    async.parallel([
      (cbParallel) => {
        // записываем запрос в БД
        pool.query({
          "text"   : "INSERT INTO (name,email,tel,message,serviceid,selecteddate,regdate) requests VALUES ($1, $2, $3, $4, $5, $6, $7)",
          "values" : [name, email, tel, message, serviceId, selectedDate, regDate]
        }, (err) => {
          if (err) console.error(err);
          if (err)
            res.status(500).send(`Произошла ошибка при обращении к базе данных: ${err.message?err.message:"неизвестная ошибка"}`);
          else
            res.status(200).send("ok");
          cbParallel(err);
        });
      },
      // Получаем список сотрудников для оповещения
      (cbParallel) => {
        pool.query("SELECT name,email FROM masters WHERE notify=true", (err, result) => {
          cbParallel(err, result?result.rows:[]);
        });
      },
      // Получаем описание услуги
      (cbParallel) => {
        pool.query({
          "text"   : "SELECT id,name,duration,price FROM service_list WHERE id=$1",
          "values" : [serviceId]
        }, (err, result) => {
          cbParallel(err, result?result.rows:[]);
        });
      }
    ], (err, result) => {
      let emails = result[1];
      let serviceObj = (result[2]&&result[2].length)?result[2][0]:{}; // выбранная услуга

      // Отправляем оповещение сотрудникам по email
      let emailToArray = [];
      emails.forEach((obj) => { emailToArray.push(`${obj.name} <${obj.email}>`) });

      // Создаём объект SMTP транспорта
      let transporter = nodemailer.createTransport(config.mail);

      // Объект сообщения
      let mailMessage = {
        "to"      : emailToArray.join(","),
        "subject" : "Новая заявка",
        "text"    : `Поступила новая заявка.\nОтправитель: ${name}\nКонтактный телефон: ${tel}\nСообщение: ${message}\nУслуга: ${serviceObj.name}\nСтоимость: ${serviceObj.price}\nДлительность:${serviceObj.duration} мин.\nВыбранное время: ${selectedDate.toLocaleString()}`
      };

      console.log("\n%j", mailMessage);

      /*
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.error('Error occurred');
          console.error(error.message);
          return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
      });
      */

    });
  });
};
