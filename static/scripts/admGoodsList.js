"use strict";
var goodTypeId = 1;
var goodButtons;
var goodsList;
var saveGoods;
var newGood;

window.addEventListener("load", function () {
  goodButtons = document.getElementsByClassName("goodButton");
  goodsList  = document.getElementById("goodsList");
  saveGoods = document.getElementById("saveGoods");
  newGood   = document.getElementById("newGood");

  // Обработчики нажатия на кнопки выбора сервисов
  for( var i=0; i<goodButtons.length; i++) {
    goodButtons[i].addEventListener("click", listGoodsFn, false);
  };

  listGoodsFn(); // Загружаем услуги

  // Обработчик нажатия на кнопку сохранения списка
  saveGoods.addEventListener("click", saveGoodsFn, false);

  // Обработчик нажатия на кнопку нового сервиса
  newGood.addEventListener("click", newGoodFn, false);

}, false);

function listGoodsFn() {
  var elmId;
  if (this) {
    elmId = this.id;
    goodTypeId = this.id.replace(/\D/g,"");
  } else {
    elmId = "type-" + goodTypeId;
  };

  // подсвечиваем выбранный тип сервис
  for( var i=0; i<goodButtons.length; i++) {
    if (goodButtons[i].id == elmId)
      goodButtons[i].classList.add("selected");
    else
      goodButtons[i].classList.remove("selected");
  };

  var req = new XMLHttpRequest();
  req.open("POST", "/admin/getGoodsList");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"goodTypeId": goodTypeId}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) goodsList.innerHTML = req.responseText;
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) goodsList.innerHTML = req.responseText;
    };
  };
};

function saveGoodsFn() {
  var nameArray = document.getElementsByName("name");
  var descriptionArray = document.getElementsByName("description");
  var priceArray = document.getElementsByName("price");
  var bulkArray = document.getElementsByName("bulk");
  var deleteArray = document.getElementsByName("delete");

  // Формируем список сервисов для сохранения
  var goodsListObj = { "goodTypeId": goodTypeId, "goodArray": [] };
  for (var i=0; i<nameArray.length; i++) {
    var goodId = nameArray[i].parentElement.parentElement.id.replace(/\D/g,"");
    if (goodId != "0") {
      var goodObj = {
        "id"          : goodId,
        "name"        : nameArray[i].value,
        "description" : descriptionArray[i].value,
        "price"       : priceArray[i].value,
        "bulk"        : bulkArray[i].value,
        "delete"      : deleteArray[i].checked
      };
      goodsListObj.goodArray.push(goodObj);
    };
  };

  // Отправляем запрос
  var req = new XMLHttpRequest();
  req.open("POST", "/admin/saveGoodsList");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify(goodsListObj));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/goodsList";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) goodsList.innerHTML = req.responseText;
    };
  };
};

function newGoodFn() {
  var templateElm = document.getElementById("good-0");
  var goodsTableElm = document.getElementById("goodsTable");
  var newGood = document.createElement("tr");
  newGood.innerHTML = templateElm.innerHTML;
  goodsTableElm.appendChild(newGood);
  newGood.scrollIntoView();
};
