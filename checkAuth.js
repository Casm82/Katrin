"use strict";
module.exports = function (req, res, next) {
  if (req.session.user)
    next();
  else
    res.status(401).redirect("/admin");
}
