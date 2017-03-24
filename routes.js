"use strict";

module.exports = (app) => {
  require("./01_index")(app);
  require("./02_enrollment")(app);
  require("./03_shop")(app);
  require("./04_price")(app);
  require("./05_feedback")(app);
  require("./06_question")(app);
  require("./07_admin")(app);
  require("./08_admServices")(app);
  require("./09_admMasters")(app);
  require("./10_admFeedback")(app);
  require("./11_admQuestions")(app);
  require("./12_admRequests")(app);
  require("./13_admGallery")(app);
};
