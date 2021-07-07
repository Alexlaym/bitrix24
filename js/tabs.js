"use strict";

var windowOnloadAdd = function windowOnloadAdd(event) {
  if (window.onload) {
    window.onload = window.onload + event;
  } else {
    window.onload = event;
  }
};

windowOnloadAdd(function () {
  var tabBtn = document.querySelectorAll('.method-tabs__item'),
      tabItem = document.querySelectorAll('.method-tabs__content');
  tabBtn.forEach(onTabClick);

  function onTabClick(e) {
    e.addEventListener('click', function () {
      if (event.target.hasAttribute("href")) {
        event.preventDefault();
      }

      var tabId = e.getAttribute('data-tab'),
          currentTab = document.querySelector(tabId);

      if (!e.classList.contains('_active')) {
        tabBtn.forEach(function (e) {
          e.classList.remove('_active');
        });
        tabItem.forEach(function (e) {
          e.classList.remove('_active');
        });
        e.classList.add('_active');
        currentTab.classList.add('_active');
      }

      if (e.getAttribute('data-tab') === '#company') {
        $('.method-sample__list .js-chart-x').each(function () {
          if (!$(this).hasClass('ready')) {
            createChartX($(this), false);
            $(this).addClass('ready');
          }
        });
        $('.method-sample__img g').addClass('animate');
      }
    });
  }

  document.querySelector('.method-tabs__item').click();
});