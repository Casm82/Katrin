"use strict";
const config       = require("./settings.json");
const routes       = require("./routes");
const path         = require("path");
const http         = require("http");
const express      = require("express");
const session      = require("express-session");
const middlewares  = require("express-middlewares");
const fileUpload   = require("express-fileupload");
const crypto       = require("crypto");
const cookieSecret = crypto.randomBytes(32).toString("base64");
var app = express();

// Параметры Express
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("x-powered-by", false);
app.use(middlewares.favicon());
app.use(middlewares.bodyParser());
app.use(fileUpload({limits: { fileSize: 100 * 1024 }}));
app.use(express.static(path.join(__dirname, "static")));

app.use(middlewares.cookieParser(cookieSecret));
app.use(session({
  "name"   : "katrin.sid",
  "secret" : cookieSecret,
  "resave" : false,
  "cookie" : { maxAge: 30*24*60*60*1000, secure: false },
  "saveUninitialized" : false
}));

routes(app);

http.createServer(app).listen(process.env.KATRIN_PORT, () => {
  console.log(`Web-сервер запущен и ожидает подключений по адресу http://127.0.0.1:${process.env.KATRIN_PORT}`);
});
