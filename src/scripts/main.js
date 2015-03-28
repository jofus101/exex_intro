/* global Firebase: false */
'use strict';

var screenIndex = 1,
util = {  
  fadeInElements: function () {    
    var delayTime = 1500,
        $screenHeader = $('#screen-'+screenIndex+' header'),
        $copyChildren = $screenHeader.children('.copy');

    $copyChildren.each(function () {
      var child = $(this);
      $screenHeader.queue(function () {
        child.addClass('visible');
        $screenHeader.dequeue();
      }).delay(delayTime); 
    });

    if (screenIndex != 6) {
      $screenHeader.promise().done(function() {
          $('#next-btn').addClass('visible');
      });
    }
  }
},
landing = {
  init: function () {
    var numScreens = $('.screen').length,
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
        $('#big-video-wrap').transit({'top':'-100%'},transitionDur);
      }

      //cute ternary Modernizer operator
      (Modernizr.csstransitions)?
        $('.wrapper').transit(
          {'top':'-'+(100*(screenIndex-1))+'%'},
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
          .css('top',0);
        showVideo();    
      }
      util.fadeInElements();
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
  },
  enter: function () {
    // Fade in the text
    
    util.fadeInElements();
  }
},
loading = {
  init: function () {

  },
  end: function () {
    $('.loading').fadeOut(160);
  }
},
firebase = {
  init: function () {
    //################################################
    // Email submission form
    //################################################
    var myFirebaseRef = new Firebase('https://flickering-inferno-9766.firebaseio.com/users/');

    function submitForm() {
      var email = $('#email_input').val().trim();

      if (!email) { return; }

      if (validateEmail(email)) {
        myFirebaseRef.push({email: email});
        displaySuccessMessage(email);
        $('#email_input').val('');
      }
      else {
        displayFailureMessage(email);
      }
    }

    function validateEmail(email) { 
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    $('#email_input').keyup(function (event) {
      var email = $(this).val().trim();

      if (!email) {
        $(this).removeClass('error success');
        $('#alert_placeholder').empty();
      } 
      else if (validateEmail(email)) {
        $(this).removeClass('error').addClass('success');
      }
      else {
        $(this).removeClass('success').addClass('error');
      }

      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13') {
        submitForm();    
      }
    });

    $('#fire_submit').click(submitForm);

    function displaySuccessMessage(email) {
      $('#alert_placeholder').empty()
        .append('Thanks for signing up');
    }
    function displayFailureMessage(email) {
      $('#alert_placeholder').empty()
        .append('We\'re sorry that doesn\'t look quite right');
    } 
  }
};

// Shorthand for $( document ).ready()
// $(function() {

  

  
//   // fade in the first screen header automagically
//   // the rest will fade in on the next button
  


  

// });