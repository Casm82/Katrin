"use strict";
var config = require("./settings.json");
var routes = require("./routes");
var express = require("express");
var middlewares = require("express-middlewares");
var http = require("http");
var path = require("path");
var app = express();

// Параметры Express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("x-powered-by", false);
app.use(middlewares.favicon());
app.use(middlewares.bodyParser());
app.use(express.static(path.join(__dirname, "static")));
routes(app);

http.createServer(app).listen(config.port, () => {
  console.log(`Web-сервер запущен и ожидает подключений по адресу http://${process.env.HOSTNAME}:${config.port}`);
});
