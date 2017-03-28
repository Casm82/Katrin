"use strict";
var saveGoodsTypes;
var newGoodsType;

window.addEventListener("load", function () {
  saveGoodsTypes = document.getElementById("saveGoodsTypes");
  newGoodsType   = document.getElementById("newGoodsType");

  // Обработчик нажатия на кнопку сохранения списка
  saveGoodsTypes.addEventListener("click", saveGoodsTypesFn, false);

  // Обработчик нажатия на кнопку нового сервиса
  newGoodsType.addEventListener("click", newGoodsTypeFn, false);

}, false);


function saveGoodsTypesFn() {
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
  req.open("POST", "/admin/goodsTypes");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"typesArray": typesArray}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) window.location = "/admin/goodsTypes";
      if (req.status === 401) window.location="/admin";
      if (req.status === 500) serviceList.innerHTML = req.responseText;
    };
  };
};

function newGoodsTypeFn() {
  var templateElm = document.getElementById("type-0");
  var servicesTableElm = document.getElementById("goodsTable");
  var newGoodsType = document.createElement("tr");
  newGoodsType.innerHTML = templateElm.innerHTML;
  servicesTableElm.appendChild(newGoodsType);
  newGoodsType.scrollIntoView();
};
