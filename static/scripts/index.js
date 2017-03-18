"use strict";

window.addEventListener("load", function () {
  var aboutShow = document.getElementById("aboutShow");
  var aboutTxt = document.getElementById("aboutTxt");
  var aboutClose = document.getElementById("aboutClose");

  var main = document.getElementById("main");
  var services = document.getElementById("services");
  var masters = document.getElementById("masters");
  var reviews = document.getElementById("reviews");
  var goods = document.getElementById("goods");
  var contacts = document.getElementById("contacts");

  // Навигация - текст
  var navTextItems = document.getElementsByClassName("navText");
  // Навигация - радиокнопки
  var radioNavItems =  document.getElementsByName("navRadio");

  // Переход между разделами
  function scrollToNavItem () {
    if (this.dataset && this.dataset.nav) {
      var navigateTo = this.dataset.nav;
      let navItemElm = document.getElementById(navigateTo);
      navItemElm.scrollIntoView({block: "start", behavior: "smooth"});

      // В меню навигации оставляем видимым только пункт,
      // отображаемый в области видимости
      /*
      var currentNavElm = document.elementFromPoint(0,100);
      for (var i=0; i<navTextItems.length; i++) {
        if (navTextItems[i].dataset.nav == currentNavElm.id)
          navTextItems[i].classList.remove("transparent")
        else
          navTextItems[i].classList.add("transparent")
      };
      */

      // Синхронизируем радиокнопки
      for (var i=0; i<radioNavItems.length; i++) {
        var radioNavValue = radioNavItems[i].dataset?radioNavItems[i].dataset.nav:null;
        radioNavItems[i].checked = radioNavValue == navigateTo;
      };
    };
  };

  // Навигация - нажатие на текст
  for (var i=0; i<navTextItems.length; i++) {
    navTextItems[i].addEventListener("click", scrollToNavItem, false);
  };
  // Навигация - выбор радиокнопки
  for (var i=0; i<radioNavItems.length; i++) {
    radioNavItems[i].addEventListener("change", scrollToNavItem, false);
  };

  // Обработчики показа и закрытия окна "О нас"
  aboutShow.addEventListener("click", function () {
    //aboutTxt.style.display = "block";
    aboutTxt.classList.remove("invisible");
    aboutTxt.classList.add("visible");
  }, false);
  aboutClose.addEventListener("click", function () {
    //aboutTxt.style.display = "none";
    aboutTxt.classList.remove("visible");
    aboutTxt.classList.add("invisible");
  }, false);

}, false);

