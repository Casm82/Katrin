"use strict";
window.addEventListener("load", function () {
  var proceed = document.getElementById("proceed"); // кнопка продолжить

  proceed.addEventListener("click", function () {
    var serviceDesc = document.getElementById("serviceDesc");
    var name = document.getElementById("name").value;
    var tel = document.getElementById("tel").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var serviceId = serviceDesc.dataset.svcid;
    var selectedDate = serviceDesc.dataset.datesel;

    if (name && tel) {
      var questionObj = { name, email, tel, message, serviceId, selectedDate };
      var req = new XMLHttpRequest();
      req.open("POST", "/register");
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      req.send(JSON.stringify(questionObj));
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status === 200) {
            // успешно отправлено - очищаем форму
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("tel").value = "";
            document.getElementById("message").value = "";
            registerResult.innerHTML = "<div>Ваш запрос отправлен.</div><div>Мы ответим на него как прочитаем.</div></div>";
          } else {
            registerResult.textContent = "Что-то пошло не так.";
          };
          // показываем блок результата
          makeElmVisible(registerResult);
          // через 2 сек - прячем результат
          setTimeout(function () {
            makeElmInvisible(registerResult);
            window.location = "/";
          }, 2000);
        };
      };
    } else {
      registerResult.innerHTML = "Укажите, пожалуйства, имя и телефон";
      makeElmVisible(registerResult);
      setTimeout(function () { makeElmInvisible(registerResult) }, 3000);
    };
  }, false);

}, false);

// Вспомогательные функции показывают или прячут элемент
function makeElmVisible (elm) {
  elm.classList.remove("invisible");
  elm.classList.add("visible");
};
function makeElmInvisible (elm) {
  elm.classList.add("invisible");
  elm.classList.remove("visible");
};
