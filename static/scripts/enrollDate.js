"use strict";
var proceed;  // кнопка продолжить
var days;     // ячейки выбора числа
var times;    // ячейки выбора времени
var curDate = new Date();
var selectedYear = curDate.getFullYear();
var selectedMonth;
var selectedDay;
var selectedDateObj;  // объект выбранного времени
var selectedDate;     // текст выбранного времени
var serviceDesc;      // описание выбранного сервиса и времени
                      // (в dataset.svcid - хранится id выбранного сервиса)

window.addEventListener("load", function () {
  proceed = document.getElementById("proceed");
  selectedDate = document.getElementById("selectedDate");
  serviceDesc = document.getElementById("serviceDesc");
  days = document.getElementsByClassName("curMonth");
  times = document.getElementsByClassName("time");
  
  proceed.disabled = true;
  selectedMonth = serviceDesc.dataset.monthnum;
  
  for (var i=0; i < days.length; i++) {
    days[i].addEventListener("click", daySelectedFn, false);
  };
  
  proceed.addEventListener("click", function (){
    window.location="/enrollment/" + serviceDesc.dataset.svcid + "/" + selectedDateObj.getTime();
  }, false)
}, false);

function daySelectedFn() {
  selectedDay = this.textContent;
  proceed.disabled = true;
  selectedDate.textContent = "Выберите время";
  
  for (var i=0; i < days.length; i++) {
    if (this == days[i])
      days[i].classList.add("selected");
    else
      days[i].classList.remove("selected");
  };
  
  for (var i=0; i < times.length; i++) {
    times[i].classList.remove("inavilable");
    times[i].classList.add("available");
    times[i].classList.remove("selected");
    times[i].removeEventListener("click", timeSelectedFn, false);
    times[i].addEventListener("click", timeSelectedFn, false);
  };
};

function timeSelectedFn() {
  var selectedHour = this.dataset.hour;
  var selectedMin = this.dataset.min;
  selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMin);
  selectedDate.textContent = selectedDateObj.toLocaleString();
  proceed.disabled = false;
  console.log(selectedDateObj);
  for (var i=0; i < times.length; i++) {
    if (this == times[i])
      times[i].classList.add("selected");
    else
      times[i].classList.remove("selected");
  };
};