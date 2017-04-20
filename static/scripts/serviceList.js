"use strict";
var serviceList;
var buttons;

window.addEventListener("load", function () {
  serviceList = document.getElementById("serviceList");

  buttons = document.getElementsByClassName("button");
  for( var i=0; i<buttons.length; i++) {
    buttons[i].addEventListener("click", listSericesFn, false);
  };

  listSericesFn(1);
}, false);

function listSericesFn(type) {
  var serviceType = this?this.id.replace(/\D/g,""):type;
  // подсвечиваем выбранный тип сервис
  for( var i=0; i<buttons.length; i++) {
    if (buttons[i].id == "type-"+serviceType)
      buttons[i].classList.add("selected");
    else
      buttons[i].classList.remove("selected");
  };

  var req = new XMLHttpRequest();
  req.open("POST", "/serviceList");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.send(JSON.stringify({"serviceType": serviceType}));
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) serviceList.innerHTML = req.responseText;
      if (req.status === 500) serviceList.innerHTML = req.responseText;
    };
  };
};
