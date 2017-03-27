"use strict";
var saveServices;
var newService;

window.addEventListener("load", function () {
  saveServices = document.getElementById("saveServices");
  newService   = document.getElementById("newService");

  // Обработчик нажатия на кнопку сохранения списка
  saveServices.addEventListener("click", saveServicesFn, false);

  // Обработчик нажатия на кнопку нового сервиса
  newService.addEventListener("click", newServiceFn, false);

}, false);


function saveServicesFn() {
  var nameArray = document.getElementsByName("name");
  var deleteArray = document.getElementsByName("delete");

  // Формируем список типов сервисов для сохранения
  var typesArray = [];
  for (var i=0; i<nameArray.length; i++) {
    var typeId = nameArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if (typeId != "0") {
      var typeObj = {
        "id"     : typeId,
        "name"   : nameArray[i].value,
        "delete" : deleteArray[i].checked
      };
      typesArray.push(typeObj);
    };
  };

  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/serviceType");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"typesArray": typesArray}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/serviceType";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) serviceList.innerHTML = req.responseText;
    };
  };
};

function newServiceFn() {
  var templateElm = document.getElementById("type-0");
  var servicesTableElm = document.getElementById("servicesTable");
  var newService = document.createElement("tr");
  newService.innerHTML = templateElm.innerHTML;
  servicesTableElm.appendChild(newService);
  newService.scrollIntoView();
};
