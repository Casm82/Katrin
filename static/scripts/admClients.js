"use strict";
var saveList;
var newClient;

window.addEventListener("load", function () {
  saveList = document.getElementById("saveList");
  newClient = document.getElementById("newClient");

  // Обработчик нажатия на кнопку сохранения списка
  saveList.addEventListener("click", saveListFn, false);

  // Обработчик нажатия на кнопку нового мастера
  newClient.addEventListener("click", newClientFn, false);

}, false);

function saveListFn() {
  var nameArray = document.getElementsByName("name");
  var emailArray = document.getElementsByName("email");
  var telArray = document.getElementsByName("tel");
  var deleteArray = document.getElementsByName("delete");

  // Формируем список мастеров для сохранения
  var clientsArray = [];
  for (var i=0; i<nameArray.length; i++) {
    var clientId = nameArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if ((nameArray[i].value || deleteArray[i].checked) && (clientId != "0")) {
      var mstObj = {
        "id"     : clientId,
        "name"   : nameArray[i].value,
        "email"  : emailArray[i].value,
        "tel"    : telArray[i].value,
        "delete" : deleteArray[i].checked
      };
      clientsArray.push(mstObj);
    };
  };

  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/clients");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(clientsArray));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/clients";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) masterList.innerHTML = req.responseText;
    };
  };
};

function newClientFn() {
  var templateElm = document.getElementById("client-0");
  var mastersTableElm = document.getElementById("clientsTable");
  var newClient = document.createElement("tr");
  newClient.innerHTML = templateElm.innerHTML;
  mastersTableElm.appendChild(newClient);
  newClient.scrollIntoView();
};
