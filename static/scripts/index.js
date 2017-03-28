"use strict";

window.addEventListener("load", function () {
  // Прописываем контактную почту через JS
  document.getElementById("contactMail").innerHTML = "katrin-app@yandex.ru"

  // Навигация - текст
  var navTextItems = document.getElementsByClassName("navText");
  // Навигация - нажатие на текст
  for (var i=0; i<navTextItems.length; i++) {
    navTextItems[i].addEventListener("click", scrollToNavItem, false);
  };
  // Переход между разделами
  function scrollToNavItem () {
    if (this.dataset && this.dataset.nav) {
      var navigateTo = this.dataset.nav;
      let navItemElm = document.getElementById(navigateTo);
      navItemElm.scrollIntoView({block: "start", behavior: "smooth"});
    };
  };

  // Обработчики показа и закрытия окна "О нас"
  var aboutShow = document.getElementById("aboutShow"); // кнопка "О нас"
  var aboutTxt = document.getElementById("aboutTxt");   // блок приветствия
  aboutShow.addEventListener("click", function () {
    makeElmVisible(aboutTxt);
  }, false);

  // Обработчики показа и закрытия окна "Оставить отзыв"
  var feedbackShow = document.getElementById("feedbackShow"); // кнопка "Оставить отзыв"
  var feedbackResult = document.getElementById("feedbackResult"); //  результат отправки формы
  var submitFeedback = document.getElementById("submitFeedback");  // кнопка отправки формы отзыва
  feedbackShow.addEventListener("click", function () {
    makeElmVisible(feedbackTxt);
  }, false);
  // Обработчик отправки отзыва
  submitFeedback.addEventListener("click", function () {
    var name    = document.getElementById("fb_name").value;
    var email   = document.getElementById("fb_email").value;
    var tel     = document.getElementById("fb_tel").value;
    var title   = document.getElementById("fb_title").value;
    var message = document.getElementById("fb_message").value;
    if (message) {
      var feedbackObj = { name, email, tel, title, message };
      var req = new XMLHttpRequest();
      req.open("POST", "/feedback");
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      req.send(JSON.stringify(feedbackObj));
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status === 200) {
            // успешно отправлено - очищаем форму
            document.getElementById("fb_name").value = "";
            document.getElementById("fb_email").value = "";
            document.getElementById("fb_tel").value = "";
            document.getElementById("fb_title").value = "";
            document.getElementById("fb_message").value = "";
            feedbackResult.innerHTML = "Спасибо за отзыв!";
          };
          if (req.status === 500) feedbackResult.innerHTML = "Что-то пошло не так.";
          // прячем форму отзыва
          makeElmInvisible(feedbackTxt);
          // показываем блок результата
          makeElmVisible(feedbackResult);
          // через 2 сек - прячем результат
          setTimeout(function () { makeElmInvisible(feedbackResult) }, 1500);
        };
      };
    };
  }, false);

  // Обработчик отправки вопроса
  var submitQuestion = document.getElementById("submitQuestion"); // кнопка отправки формы вопроса
  submitQuestion.addEventListener("click", function () {
    var name    = document.getElementById("q_name").value;
    var email   = document.getElementById("q_email").value;
    var tel     = document.getElementById("q_tel").value;
    var message = document.getElementById("q_message").value;
    if (message && (tel||email)) {
      var questionObj = { name, email, tel, message };
      var req = new XMLHttpRequest();
      req.open("POST", "/question");
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      req.send(JSON.stringify(questionObj));
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (req.status === 200) {
            // успешно отправлено - очищаем форму
            document.getElementById("q_name").value = "";
            document.getElementById("q_email").value = "";
            document.getElementById("q_tel").value = "";
            document.getElementById("q_message").value = "";
            questionResult.innerHTML = "<div>Ваш вопрос отправлен.</div><div>Мы ответим на него как прочитаем.</div></div>";
          };
          if (req.status === 500) questionResult.textContent = "Что-то пошло не так.";
          // показываем блок результата
          makeElmVisible(questionResult);
          // через 2 сек - прячем результат
          setTimeout(function () { makeElmInvisible(questionResult) }, 3000);
        };
      };
    };
  }, false);

  // Кнопки закрытия в блоках "О нас" и "Оставить отзыв"
  var btnCloseElms = document.getElementsByClassName("btnClose");
  for (var i=0; i<btnCloseElms.length; i++) {
    btnCloseElms[i].addEventListener("click", hideBlockFn, false);
  };
  function hideBlockFn() {
    this.parentElement.classList.remove("visible");
    this.parentElement.classList.add("invisible");
  };

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
