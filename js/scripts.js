"use strict";

$(document).ready(function () {
  var width = $(window).width(),
      height = $(window).height();
  console.log('Width: ' + width + 'px');
  console.log('Height: ' + height + 'px');
  headerMenu = $('.header-menu ul'); // --- Подскроливание при загрузке страницы ---

  if (window.location.hash !== "") {
    $('html, body').animate({
      scrollTop: 0
    }, 0);
    setTimeout(function () {
      var anc = window.location.hash.replace("#", "");
      anc = $('body').find('#' + anc);
      $('html, body').animate({
        scrollTop: anc.offset().top - $('header').outerHeight(true)
      }, 1000);
      window.location.hash = '';
    }, 200);
  }

  svg4everybody();
  progressPage();
  paralax(); // hand()

  allAnimatesOnScroll();
  groupDots('.method-stat__respondent-item', '.method-stat__respondent-chart', '.js-line-angle');
});
$(window).on('scroll', function () {
  allAnimatesOnScroll();
  setNavActive();
});
$(window).resize(function () {
  groupDots('.method-stat__respondent-item', '.method-stat__respondent-chart', '.js-line-angle');
});
$(document).on('click', '._goto-block', function (e) {
  e.preventDefault();
  var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top;
  $('html, body').animate({
    scrollTop: offsetTop - $('header').outerHeight(true)
  }, 1000);
  window.location.hash = href;
});
$(document).on('click', '.js-menu', function (e) {
  $('.js-menu').toggleClass('closed opened');
  $('body').height($(window).height());
  $('body').toggleClass('_overflow');
  $('.header-menu').toggleClass('active');
  $('.header').toggleClass('dark');
});

function allAnimatesOnScroll() {
  actionOnScroll('.js-draw-scroll', drawSvg);
  actionOnScroll('.js-numerator-scroll', startNumerator);
  actionOnScroll('.js-animate', animate);
  actionOnScroll('.js-chart-x-scroll', createChartXOnScroll);
  actionOnScroll('.js-chart-y-scroll', createChartYOnScroll);
}

function progressPage() {
  var progress = document.querySelector('.header-progress');
  window.addEventListener('scroll', progressBar);

  function progressBar(e) {
    var windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var per = windowScroll / windowHeight * 100;
    progress.style.width = per + '%';
  }
}

function paralax() {
  var parallax = document.querySelector('.ms');

  if (parallax) {
    var setMouseParallaxStyle = function setMouseParallaxStyle() {
      var distX = coordXprocent - positionX;
      var distY = coordYprocent - positionY;
      positionX = positionX + distX * speed;
      positionY = positionY + distY * speed; //передаём стили

      _hand.style.cssText = "transform: translate(".concat(positionX / forHand, "%,").concat(positionY / forHand, "%);");
      requestAnimationFrame(setMouseParallaxStyle);
    };

    var content = document.querySelector('.ms-wrp');

    var _hand = document.querySelector('.ms-hand'); //Коэффиценты


    var forHand = 10; //Скорость анимации

    var speed = 0.05; //Объявление переменных

    var positionX = 0,
        positionY = 0;
    var coordXprocent = 0,
        coordYprocent = 0;
    setMouseParallaxStyle();
    parallax.addEventListener("mousemove", function (e) {
      //Получаем ширину и высоту блока
      var parallaxWidth = parallax.offsetWidth;
      var parallaxHeight = parallax.offsetHeight; //Ноль посередине

      var coordX = e.pageX - parallaxWidth / 2;
      var coordY = e.pageY - parallaxHeight / 2; //Получаем проценты

      coordXprocent = coordX / parallaxWidth * 100;
      coordYprocent = coordY / parallaxHeight * 100;
    });
  }
}

function animate(element) {
  element.addClass('animate');
}

function drawSvg(element) {
  if (!element.hasClass('svg-drawn')) {
    var value = parseInt(element.attr('data-value')),
        pathLength = Math.PI * 2 * parseInt(element.attr('r')); // pathLength = element[0].getTotalLength()

    var delay = parseInt(element.attr('data-delay'));

    if (!delay || typeof delay === 'undefined') {
      delay = 1;
    }

    resetSvg(element);
    setTimeout(function () {
      element.addClass('ready');
      element.css('stroke-dashoffset', -1 * pathLength - value / 100 * pathLength);
      element.addClass('svg-drawn');
    }, delay);
  }
}

function resetSvg(element) {
  var pathLength = Math.PI * 2 * parseInt(element.attr('r')); // const pathLength = element[0].getTotalLength()

  element.css({
    'stroke-dasharray': pathLength,
    'stroke-dashoffset': -1 * pathLength
  });
}

function elementIsVisible(elements, callback) {
  elements.each(function () {
    var wt = $(window).scrollTop(),
        wh = $(window).height(),
        et = $(this).offset().top,
        eh = $(this).outerHeight();

    if (wt + wh >= et && wt + wh - eh * 2 <= et + (wh - eh)) {
      callback($(this));
    }
  });
}

function actionOnScroll(selector, action) {
  var elements = $(selector);

  if (elements.length) {
    elementIsVisible(elements, action);
  }
}

function startNumerator(element) {
  var value = parseFloat(element.attr('data-value'));
  $(element).numerator({
    easing: 'linear',
    duration: 1000,
    toValue: value,
    onComplete: function onComplete() {
      if (value < 1) {
        value = '<1';
        element.text('<1');
      }

      if (element.width() > element.parent().width()) {
        element.addClass('invisible');
      }

      element.attr('title', "".concat(value, "%"));
    }
  });
}

function createChartX(element, isInnerCount) {
  var values = element.attr('data-values').split(', ');
  values.map(function (item) {
    var value = parseFloat(item),
        chartItem = $("<div class=\"chart-x__item\" data-width=\"".concat(value, "\"></div>")),
        innerCount = $("<div class=\"chart-x__count js-count\" data-value=\"".concat(value, "\" data-after=\"%\"></div>"));

    if (isInnerCount) {
      chartItem.append(innerCount);
      element.append(chartItem);
    } else {
      element.append(chartItem);
      element.append(innerCount);
    }

    element.find('.chart-x__item').each(function () {
      $(this).width("".concat($(this).attr('data-width'), "%"));
    });
    element.find('.chart-x__count').each(function () {
      startNumerator($(this));
    });
  });

  if ($(element).hasClass('js-total-count')) {
    totalCount($(element));
  }
}

function createChartXOnScroll(item) {
  if (!item.hasClass('ready')) {
    createChartX(item, true);
    item.addClass('ready');
  }
}

function createChartY(element, isInnerCount) {
  var values = element.attr('data-values').split(', ');
  values.map(function (item) {
    var value = parseFloat(item),
        chartItem = $("<div class=\"chart-y__item\" data-height=\"".concat(value, "\"></div>")),
        innerCount = $("<div class=\"chart-y__count js-count\" data-value=\"".concat(value, "\" data-after=\"%\"></div>"));

    if (isInnerCount) {
      chartItem.append(innerCount);
      element.append(chartItem);
    } else {
      element.append(chartItem);
      element.append(innerCount);
    }

    element.find('.chart-y__item').each(function () {
      $(this).height("".concat($(this).attr('data-height'), "%"));
    });
    element.find('.chart-y__count').each(function () {
      startNumerator($(this));
    });
  });
}

function createChartYOnScroll(item) {
  if (!item.hasClass('ready')) {
    createChartY(item, true);
    item.addClass('ready');
  }
}

function setLineAngle(array, line) {
  var dx = array[0].x - array[1].x,
      dy = array[0].y - array[1].y,
      lineWidth = Math.sqrt(dx * dx + dy * dy),
      angle = 180 / Math.PI * Math.acos(dx / lineWidth);

  if (dx < 0) {
    angle = 180 - angle;

    if (dy > 0) {
      angle *= -1;
    }
  }

  line.css({
    'width': lineWidth,
    'transform': "rotate(".concat(angle, "deg)")
  });
}

function groupDots(selector1, selector2, selectorLine) {
  $(selector1).each(function () {
    var dataLegend = $(this).attr('data-legend'),
        line = $("[data-legend=\"".concat(dataLegend, "\"] ").concat(selectorLine)),
        dotGoup = [$(this).find('.js-legend-dot'), $("".concat(selector2, " [data-legend=\"").concat(dataLegend, "\"] .js-legend-dot"))],
        dotCoordinatesGoup = [];
    dotGoup.forEach(function (item) {
      var $thisRect = item[0].getBoundingClientRect(),
          dotCoordinates = {
        x: $thisRect.x,
        y: $thisRect.y
      };
      dotCoordinatesGoup.push(dotCoordinates);
    });
    setLineAngle(dotCoordinatesGoup, line);
  });
}

function totalCount(element) {
  $(element).each(function () {
    var items = $(this).find('.js-count'),
        itemsValues = [];
    items.each(function () {
      itemsValues.push(parseInt($(this).attr('data-value')));
    });
    var sum = itemsValues.reduce(function (sum, current) {
      return sum + current;
    }, 0);
    $("<div class=\"h5 js-count\" data-value=\"".concat(sum, "\" data-after=\"%\"></div>")).insertAfter($(element));
    startNumerator(element.siblings('.js-count'));
  });
}

var headerMenu = null,
    CurItem = '';

function setNavActive() {
  $('.js-anchor-id').each(function () {
    if ($(window).scrollTop() > $(this).offset().top - 200) {
      CurItem = $(this).attr('id');
    }
  });
  var noActiveItem = headerMenu.find('._goto-block._active').length == 0,
      newActiveRequired = headerMenu.find('._goto-block._active').attr('href') != '#' + CurItem;

  if (noActiveItem || newActiveRequired) {
    headerMenu.find('._goto-block').removeClass('_active');
    headerMenu.find("._goto-block[href=\"#".concat(CurItem, "\"]")).addClass('_active');
  }
}

function hand() {
  var linGrad = document.querySelectorAll('.color-js'),
      colors = ['#00FF00', '#FF33FF', '#FF0000', '#0000FF', '#FFFF33', '#2FC7F7', '#E2FE49'];

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function getRandomLinGrad() {
    console.log(linGrad[Math.floor(Math.random() * linGrad.length)]);
    return linGrad[Math.floor(Math.random() * linGrad.length)];
  }

  function randomCreateLinGrad() {
    createRandomItem.setAttribute('stop-color', "".concat(createRandomColor));
  }

  var createRandomColor = getRandomColor(),
      createRandomItem = getRandomLinGrad();
  randomCreateLinGrad();
  setTimeout(hand, 1000);
}

$(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (event) {
  var width = $(window).width(),
      delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail),
      header = $('.header');

  if (width > 990) {
    if (delta >= 0) {
      if (header.hasClass('hidden')) {
        header.removeClass('hidden');
      }
    } else {
      if (!header.hasClass('hidden')) {
        header.addClass('hidden');
      }
    }
  }
});