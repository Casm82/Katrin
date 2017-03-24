"use strict";
var showCompleted;
var requestsList;

window.addEventListener("load", function () {
  requestsList = document.getElementById("requestsList");
  
  // Обработчик нажатия на кнопку сохранения списка
  var saveList = document.getElementById("saveList");
  saveList.addEventListener("click", saveListFn, false);
  
  // Обработчик нажатия на чекбокс "Показывать отвеченные вопросы"
  showCompleted = document.getElementById("showCompleted");
  showCompleted.addEventListener("change", requestsListFn, false);
  
  requestsListFn();
}, false);

function requestsListFn() {
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/listRequests");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"showCompleted": showCompleted.checked}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) requestsList.innerHTML = req.responseText;
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) requestsList.innerHTML = req.responseText;
    };
  };
};

function saveListFn() {
  var completedArray = document.getElementsByName("completed");
  var deleteArray = document.getElementsByName("delete");
  
  // Формируем список заявков для сохранения
  var requestsArray = [];
  for (var i=0; i<completedArray.length; i++) {
    var requestId = completedArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    var requestObj = {
      "id"        : requestId,
      "completed" : completedArray[i].checked,
      "delete"    : deleteArray[i].checked
    };
    requestsArray.push(requestObj);
  };
  
  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveRequests");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(requestsArray));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/requests";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) requestsList.innerHTML = req.responseText;
    };
  };
};