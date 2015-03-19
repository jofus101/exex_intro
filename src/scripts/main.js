'use strict';

// Shorthand for $( document ).ready()
$(function() {

  var screenIndex = 1,
  numScreens = $('.screen').length,
  isTransitioning = false,
  transitionDur = 1000,
  BV,
  isTouch = Modernizr.touch,
  $bigImage = $('.big-image'),
  $window = $(window);

  $('#next-btn').on('click', function(e) {
    e.preventDefault();
    if (!isTransitioning) {
      next();
    }
  });

  if (!isTouch) {
    BV = new $.BigVideo({useFlashForFirefox:false, forceAutoplay:isTouch});
    BV.init();
    showVideo();

    BV.getPlayer().addEvent('loadeddata', function() {
      onVideoLoaded();
    });

    $bigImage
      .css('position','relative')
      .imagesLoaded(adjustImagePositioning);

    $window.on('resize', adjustImagePositioning);
  }

  function next() {
    isTransitioning = true;
    // update video index
    if (screenIndex === numScreens) {
      screenIndex = 1;
    } else {
      screenIndex++;
    }

    $('.wrapper').transit(
      {'left':'-'+(100*(screenIndex-1))+'%'},
      transitionDur,
      onTransitionComplete);
  }

  function onVideoLoaded() {
    $('#screen-'+screenIndex).find('.big-image').transit({'opacity':0},200);
  }

  function showVideo() {
    BV.show($('#screen-'+screenIndex).attr('data-video'),{ambient:true});
  }

  function onTransitionComplete() {
    isTransitioning = false;
    if (!isTouch) {
      $('#big-video-wrap')
        .css('left',0);
      showVideo();    
    }
  }

  function adjustImagePositioning() {
    $bigImage.each(function(){
      var $img = $(this),
        img = new Image();

      img.src = $img.attr('src');

      var windowWidth = $window.width(),
            windowHeight = $window.height(),
            windowRatio = windowHeight / windowWidth,
            imageWidth = img.width,
            imageHeight = img.height,
            imageRatio = imageHeight / imageWidth,
            newWidth, newHeight; // new_left, new_top;

        if( windowRatio > imageRatio ) {
            newHeight   = windowHeight;
            newWidth   = windowHeight / imageRatio;
        }
        else {
            newHeight   = windowWidth * imageRatio;
            newWidth   = windowWidth;
        }

        $img.css({
            width   : newWidth,
            height  : newHeight,
            left    : ( windowWidth - newWidth ) / 2,
            top     : ( windowHeight - newHeight ) / 2
        });
    });
  }   
});