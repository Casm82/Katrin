"use strict";
var saveList;
var newMaster;

window.addEventListener("load", function () {
  saveList = document.getElementById("saveList");
  newMaster = document.getElementById("newMaster");

  // Обработчик нажатия на кнопку сохранения списка
  saveList.addEventListener("click", saveListFn, false);

  // Обработчик нажатия на кнопку нового мастера
  newMaster.addEventListener("click", newMasterFn, false);

}, false);

function saveListFn() {
  var nameArray = document.getElementsByName("name");
  var titleArray = document.getElementsByName("title");
  var emailArray = document.getElementsByName("email");
  var notifyArray = document.getElementsByName("notify");
  var mainPageArray = document.getElementsByName("main_page");
  var telArray = document.getElementsByName("tel");
  var deleteArray = document.getElementsByName("delete");

  // Формируем список мастеров для сохранения
  var mstArray = [];
  for (var i=0; i<nameArray.length; i++) {
    var mstId = nameArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if ((nameArray[i].value || deleteArray[i].checked) && (mstId != "0")) {
      var mstObj = {
        "id"        : mstId,
        "name"      : nameArray[i].value,
        "title"     : titleArray[i].value,
        "email"     : emailArray[i].value,
        "notify"    : notifyArray[i].checked,
        "main_page" : mainPageArray[i].checked,
        "tel"       : telArray[i].value,
        "delete"    : deleteArray[i].checked
      };
      mstArray.push(mstObj);
    };
  };

  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveMasters");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(mstArray));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/masters";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) masterList.innerHTML = req.responseText;
    };
  };
};

function newMasterFn() {
  var templateElm = document.getElementById("mst-0");
  var mastersTableElm = document.getElementById("mastersTable");
  var newMaster = document.createElement("tr");
  newMaster.innerHTML = templateElm.innerHTML;
  mastersTableElm.appendChild(newMaster);
  newMaster.scrollIntoView();
};
