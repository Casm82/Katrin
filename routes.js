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
};
