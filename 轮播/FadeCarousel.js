/*
* @Author: Marte
* @Date:   2017-08-28 09:28:09
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 09:34:44
*/
var $imgs = $('.carousel__img-wrap li'),
        imgWidth = $('.carousel__img-wrap img').eq(0).width(),
        $imgWrap = $('.carousel__img-wrap').eq(0),
        pageIndex = 0,
        $next = $('.carousel--play-next'),
        $pre = $('.carousel--play-pre'),
        $index = $('.carousel__display-index li'),
        isCompleteAnimate = true,
        carouselIntervalId ;

    $next.on('click', function(){
      playNext();
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;
    });

    $pre.on('click', function(){
      playPre();
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;

    });


    $index.on('click', function(){
      var curClickIndex = $(this).index();
      play(curClickIndex);
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;

    });

    autoPlay()

    function autoPlay(){
      carouselIntervalId = setInterval(function(){
        playNext();
      }, 1500);
    }

    function dispIndex(index){
      $index.removeClass('active').eq(index).addClass('active');
    }

    function playPre(){
      play(((pageIndex?pageIndex:$imgs.length) - 1));
    }

    function playNext(){
      play((pageIndex + 1)%$imgs.length);
    }

    function play(index){
      if (!isCompleteAnimate) {
        return ;
      }
      isCompleteAnimate = false;
      $imgs.eq(pageIndex).fadeOut('500');
      $imgs.eq(index).fadeIn('500', function() {
          isCompleteAnimate = true;
          if (!carouselIntervalId) {
          //自动播放
          carouselIntervalId = setInterval(function(){
            playNext(1);
          }, 1500);
        }

      });
      pageIndex = index;
      dispIndex(pageIndex);
    }