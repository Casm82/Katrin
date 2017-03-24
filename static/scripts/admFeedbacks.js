"use strict";
var showApproved;
var feedbacksList;

window.addEventListener("load", function () {
  feedbacksList = document.getElementById("feedbacksList");
  
  // Обработчик нажатия на кнопку сохранения списка
  var saveList = document.getElementById("saveList");
  saveList.addEventListener("click", saveListFn, false);
  
  // Обработчик нажатия на чекбокс "Показывать утверждённые отзывы"
  showApproved = document.getElementById("showApproved");
  showApproved.addEventListener("change", listFeedbacksFn, false);
  
  listFeedbacksFn();
}, false);

function listFeedbacksFn() {
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/listFeedbacks");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"showApproved": showApproved.checked}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) feedbacksList.innerHTML = req.responseText;
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) feedbacksList.innerHTML = req.responseText;
    };
  };
};

function saveListFn() {
  var approvedArray = document.getElementsByName("approved");
  var deleteArray = document.getElementsByName("delete");
  
  // Формируем список отзывов для сохранения
  var fbArray = [];
  for (var i=0; i<approvedArray.length; i++) {
    var fbId = approvedArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if (fbId != "0") {
      var fbObj = {
        "id"       : fbId,
        "approved" : approvedArray[i].checked,
        "delete"   : deleteArray[i].checked
      };
      fbArray.push(fbObj);
    };
  };
  
  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveFeedbacks");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(fbArray));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/feedbacks";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) feedbacksList.innerHTML = req.responseText;
    };
  };
};