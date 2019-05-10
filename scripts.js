$(function() {

    var slidePages = {};

    slidePages.tolerance = 0;

    slidePages.circularScroll = true;

    // directions
    slidePages.directionUp = -1;
    slidePages.directionDown = 1;

    slidePages.numAnchors = $('[data-anchor]').length;


    // cada pagina anchor ha de tenir d'height el total de la finestra
    $('[data-anchor]').css('height', $(window).height() + 'px');

    // Add Anchors menu
    slidePages.fullPageMenu = $('<div id="slidepages-menu"></div>');
    $('body').append(slidePages.fullPageMenu);

    slidePages.fullPageMenu.on('click', '.menu-anchor', function() {

      goToAnchor($(this).data('menu-anchor'), slidePages.tolerance, 3);

    });


    slidePages.anchorPositions = [];
    var firstAnchorPosition = $('[data-anchor="0"]').offset().top;

    // calculate anchors positions
    $('[data-anchor]').each(function(index) {
      var tolerance = $(this).data('anchor-tolerance') || 0;
      slidePages.anchorPositions.push(Math.round($(this).offset().top) -firstAnchorPosition + tolerance);
      slidePages.fullPageMenu.append('<a href="#" class="menu-anchor ' + (index == 0 ? 'selected' : '') + '" data-menu-anchor="' + index + '" >' + (index + 1) + '</a>');
    });



    slidePages.currentAnchor = 0;

    setPageScrollTop(0);


    slidePages.touchStartY = 0;

    window.addEventListener("touchstart", function (e){
      slidePages.touchStartY = e.touches[0].clientY;
    });

    enableEvents();

    function enableEvents() {
      window.addEventListener (isEventSupported('mousewheel') ? "mousewheel" : "wheel", handleWheelEvent, {passive: true});
      window.addEventListener("touchmove", handleWheelEvent, {passive: true});
    }

    function disableEvents() {
      window.removeEventListener(isEventSupported('mousewheel') ? "mousewheel" : "wheel", handleWheelEvent);
      window.removeEventListener("touchmove", handleWheelEvent, {passive: true});
    }



    function handleWheelEvent(e) {

      var direction = 0; // 1 avall -1 amunt

      if(e.type == 'touchmove') {

        var wheelDelta = (slidePages.touchStartY < e.touches[0].clientY)
          ?  200  // up
          : -200; // down

      } else {

        var wheelDelta = e.wheelDelta || e.deltaY;

      }

      if(wheelDelta > 0) { // scrolling up !
        console.log('up');
        direction = slidePages.directionUp;
      } else { // scrolling down !
        console.log('down');
        direction = slidePages.directionDown;
      }


      var anchor = (direction == slidePages.directionDown) ? slidePages.currentAnchor + 1 : slidePages.currentAnchor - 1;

      goToAnchor(anchor, slidePages.tolerance);

      return false; // avoid default behaviour and propagation

    }


    function selectMenuAnchor(menuAnchor) {
      slidePages.fullPageMenu.find('.menu-anchor').removeClass('selected');
      menuAnchor.addClass('selected');
    }

    function goToAnchor(num, tolerance) { // https://css-tricks.com/snippets/jquery/smooth-scrolling/

      if(!slidePages.circularScroll && (num < 0 || num > slidePages.numAnchors - 1)) { // desactiva moviment circular
        return false; // disable circular scroll
      }

      disableEvents(); // disable events while scrolling

      if(num < 0) {
        num = slidePages.numAnchors - 1;
      } else if(num >= slidePages.numAnchors ) {
        num = 0;
      }

      
      var top = slidePages.anchorPositions[num] + tolerance;

      slidePages.currentAnchor = num; // store current anchor

      selectMenuAnchor($('.menu-anchor:eq(' + num + ')', slidePages.fullPageMenu));

      setPageScrollTop(top);

    }

    $('#slidepages').on(transitionEvent, function(e) {
      
      enableEvents();

    });


    function getPageScrollTop() {
      return Math.abs(parseInt($('#slidepages').css('top').replace('px', '')));
    }

    function setPageScrollTop(pos) {
      $('#slidepages').css('top', -pos + 'px');
    }



});

/*--------------------------------------------------------------
  # handle transition events
--------------------------------------------------------------*/

/* From Modernizr */ // https://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
    if(el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();

// check for tablet or mobile device
function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

// check for desktop or laptop
function isDesktop() {
  return !isMobile();
}

var isEventSupported = (function(){

  var TAGNAMES = {
    'select':'input','change':'input',
    'submit':'form','reset':'form',
    'error':'img','load':'img','abort':'img'
  };

function isEventSupported(eventName) {
  var el = document.createElement(TAGNAMES[eventName] || 'div');
  eventName = 'on' + eventName;
  var isSupported = (eventName in el);
  if(!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = typeof el[eventName] == 'function';
  }
  el = null;
  return isSupported;
  }
  return isEventSupported;

})();


