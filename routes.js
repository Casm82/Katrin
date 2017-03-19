"use strict";

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("index", { "title": "Кэтрин" });
  });

  app.get("/shop/organic", (req, res) => {
    res.render("organic", { "title": "Товары Organic" });
  });

  app.get("/shop/matrix", (req, res) => {
    res.render("matrix", { "title": "Товары Matrix" });
  });

  app.get("/shop/kapous", (req, res) => {
    res.render("kapous", { "title": "Товары Kapous" });
  });

  app.get("/price/face", (req, res) => {
    res.render("face", { "title": "Макияж" });
  });

  app.get("/price/hair", (req, res) => {
    res.render("hair", { "title": "Парикмахерские услуги" });
  });

  app.get("/price/nails", (req, res) => {
    res.render("nails", { "title": "Ногти" });
  });

  app.post("/feedback", (req, res) => {
    let feedback = req.body;
    let name = req.body.name?req.body.name.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let email = req.body.email?req.body.email.replace(/[^a-zA-Z@_0-9\-]/g,""):null;
    let tel = req.body.tel?req.body.tel.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let title = req.body.title?req.body.title.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let message = req.body.message?req.body.message.replace(/[^a-zA-Zа-яА-Я0-9 .,]/g,""):null;
    console.log( {name, email, tel, title, message });
    res.status(200).send("ok");
  });

  app.post("/question", (req, res) => {
    let feedback = req.body;
    let name = req.body.name?req.body.name.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let email = req.body.email?req.body.email.replace(/[^a-zA-Z@_0-9\-]/g,""):null;
    let tel = req.body.tel?req.body.tel.replace(/[^a-zA-Zа-яА-Я0-9 ]/g,""):null;
    let message = req.body.message?req.body.message.replace(/[^a-zA-Zа-яА-Я0-9 .,]/g,""):null;
    console.log( {name, email, tel, message });
    res.status(200).send("ok");
  });
};
