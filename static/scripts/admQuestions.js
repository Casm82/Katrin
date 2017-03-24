"use strict";
var showAnswered;
var questionsList;

window.addEventListener("load", function () {
  questionsList = document.getElementById("questionsList");
  
  // Обработчик нажатия на кнопку сохранения списка
  var saveList = document.getElementById("saveList");
  saveList.addEventListener("click", saveListFn, false);
  
  // Обработчик нажатия на чекбокс "Показывать отвеченные вопросы"
  showAnswered = document.getElementById("showAnswered");
  showAnswered.addEventListener("change", listQuestionsFn, false);
  
  listQuestionsFn();
}, false);

function listQuestionsFn() {
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/listQuestions");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"showAnswered": showAnswered.checked}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) questionsList.innerHTML = req.responseText;
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) questionsList.innerHTML = req.responseText;
    };
  };
};

function saveListFn() {
  var answeredArray = document.getElementsByName("answered");
  var deleteArray = document.getElementsByName("delete");
  
  // Формируем список отзывов для сохранения
  var questionArray = [];
  for (var i=0; i<answeredArray.length; i++) {
    var questionId = answeredArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if (questionId != "0") {
      var questionObj = {
        "id"       : questionId,
        "answered" : answeredArray[i].checked,
        "delete"   : deleteArray[i].checked
      };
      questionArray.push(questionObj);
    };
  };
  
  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveQuestions");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(questionArray));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/questions";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) questionsList.innerHTML = req.responseText;
    };
  };
};