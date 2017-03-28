"use strict";
var svcTypeId = 1;
var svcButtons;
var serviceList;
var saveServices;
var newService;

window.addEventListener("load", function () {
  svcButtons   = document.getElementsByClassName("svcButton");
  serviceList  = document.getElementById("serviceList");
  saveServices = document.getElementById("saveServices");
  newService   = document.getElementById("newService");

  // Обработчики нажатия на кнопки выбора сервисов
  for( var i=0; i<svcButtons.length; i++) {
    svcButtons[i].addEventListener("click", listServicesFn, false);
  };
  listServicesFn(); // Загружаем услуги

  // Обработчик нажатия на кнопку сохранения списка
  saveServices.addEventListener("click", saveServicesFn, false);

  // Обработчик нажатия на кнопку нового сервиса
  newService.addEventListener("click", newServiceFn, false);

}, false);

function listServicesFn() {
  var elmId;
  if (this) {
    elmId = this.id;
    svcTypeId = this.id.replace(/\D/g,"");
  } else {
    elmId = "type-" + svcTypeId;
  };

  // подсвечиваем выбранный тип сервис
  for( var i=0; i<svcButtons.length; i++) {
    if (svcButtons[i].id == elmId)
      svcButtons[i].classList.add("selected");
    else
      svcButtons[i].classList.remove("selected");
  };

  var req = new XMLHttpRequest();
  req.open("POST", "/admin/listServices");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"svcTypeId": svcTypeId}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) serviceList.innerHTML = req.responseText;
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) serviceList.innerHTML = req.responseText;
    };
  };
};

function saveServicesFn() {
  var nameArray = document.getElementsByName("name");
  var descriptionArray = document.getElementsByName("description");
  var durationArray = document.getElementsByName("duration");
  var priceArray = document.getElementsByName("price");
  var deleteArray = document.getElementsByName("delete");

  // Формируем список сервисов для сохранения
  var svcListObj = { "svcTypeId": svcTypeId, "svcArray": [] };
  for (var i=0; i<nameArray.length; i++) {
    var svcId = nameArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if (svcId != "0") {
      var svcObj = {
        "id"          : svcId,
        "name"        : nameArray[i].value,
        "description" : descriptionArray[i].value,
        "duration"    : durationArray[i].value,
        "price"       : priceArray[i].value,
        "delete"      : deleteArray[i].checked
      };
      svcListObj.svcArray.push(svcObj);
    };
  };

  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveServices");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(svcListObj));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/services";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) serviceList.innerHTML = req.responseText;
    };
  };
};

function newServiceFn() {
  var templateElm = document.getElementById("svc-0");
  var servicesTableElm = document.getElementById("servicesTable");
  var newService = document.createElement("tr");
  newService.innerHTML = templateElm.innerHTML;
  servicesTableElm.appendChild(newService);
  newService.scrollIntoView();
};
