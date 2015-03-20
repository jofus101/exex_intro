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

    // Clean up old page stuff
    $('#next-btn').removeClass('visible');
    $('#screen-'+screenIndex+' header').children().each(function () {
      $(this).removeClass('visible');
    });


    // update video index, reset image opacity if starting over
    if (screenIndex === numScreens) {
      $bigImage.css('opacity', 1);
      screenIndex = 1;
    } else {
      screenIndex++;
    }

    if (!isTouch) {
      $('#big-video-wrap').transit({'left':'-100%'},transitionDur);
    }

    //cute ternary Modernizer operator
    (Modernizr.csstransitions)?
      $('.wrapper').transit(
        {'left':'-'+(100*(screenIndex-1))+'%'},
        transitionDur,
        onTransitionComplete):
      onTransitionComplete();
  }

  function onVideoLoaded() {
    $('#screen-'+screenIndex).find('.big-image').transit({'opacity':0},500);
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
    fadeInElements();
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

  // Fade in the text
  function fadeInElements() {
    var delayTime = 1500;
    var $screenHeader = $('#screen-'+screenIndex+' header');
    
    $screenHeader.queue(function () {
      $screenHeader.find('.copy:nth-child(1)').addClass('visible');
      $(this).dequeue();
    })
    .delay(delayTime)
    .queue(function () {
      $screenHeader.find('.copy:nth-child(2)').addClass('visible');
      $(this).dequeue();
    })
    .delay(delayTime)
    .queue(function () {
      $screenHeader.find('.copy:nth-child(3)').addClass('visible');
      $(this).dequeue();
    })
    .delay(delayTime);

    console.log($screenHeader.queue());

    $screenHeader.promise().done(function() {
      $('#next-btn').addClass('visible');
    });
    
  }
  // fade in the first screen header automagically
  // the rest will fade in on the next button
  fadeInElements();

});