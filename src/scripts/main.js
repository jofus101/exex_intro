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

    // $bigImage
    //   .css('position','relative')
    //   .imagesLoaded(adjustImagePositioning);

    // $window.on('resize', adjustImagePositioning);
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

  // function adjustImagePositioning() {
  //   $bigImage.each(function(){
  //     var $img = $(this),
  //       img = new Image();

  //     img.src = $img.attr('src');

  //     var windowWidth = $window.width(),
  //           windowHeight = $window.height(),
  //           r_w = windowHeight / windowWidth,
  //           i_w = img.width,
  //           i_h = img.height,
  //           r_i = i_h / i_w,
  //           new_w, new_h, new_left, new_top;

  //       if( r_w > r_i ) {
  //           new_h   = windowHeight;
  //           new_w   = windowHeight / r_i;
  //       }
  //       else {
  //           new_h   = windowWidth * r_i;
  //           new_w   = windowWidth;
  //       }

  //       $img.css({
  //           width   : new_w,
  //           height  : new_h,
  //           left    : ( windowWidth - new_w ) / 2,
  //           top     : ( windowHeight - new_h ) / 2
  //       });
  //   });
  // }   
});