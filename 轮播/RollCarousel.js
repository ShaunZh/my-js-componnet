/*
* @Author: Marte
* @Date:   2017-08-28 08:55:01
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 09:30:42
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
    $imgWrap.append($imgs.first().clone());
    $imgWrap.prepend($imgs.last().clone());
    $imgWrap.width(($imgs.length + 2) * imgWidth);
    $imgWrap.css({left: -imgWidth});

    $next.on('click', function(){
      playNext(1);
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;

    });
    $pre.on('click', function(){
      playPre(1);
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;
    });
    $index.on('click', function(){
      var curClickIndex = $(this).index();
      if (curClickIndex > pageIndex) {
        playNext(curClickIndex - pageIndex);
      } else if (curClickIndex < pageIndex) {
        playPre(pageIndex - curClickIndex);
      }
      clearInterval(carouselIntervalId);
      carouselIntervalId = 0;
    });

    //自动播放
    carouselIntervalId = setInterval(function(){
      playNext(1);
    }, 1500);

    function dispIndex(index){
      $index.removeClass('active').eq(index).addClass('active');
    }

    function playNext(len){
      if (!isCompleteAnimate) {
        return ;
      }
      isCompleteAnimate = false;
      $imgWrap.animate({
        left: '-=' + (imgWidth * len)},
        500, function() {
        /* stuff to do after animation is complete */
        pageIndex += len;
        if (pageIndex === ($imgs.length)) {
          pageIndex = 0;
          $imgWrap.css({left: -imgWidth});
        }
        dispIndex(pageIndex);
        isCompleteAnimate = true;
        if (!carouselIntervalId) {
          //自动播放
          carouselIntervalId = setInterval(function(){
            playNext(1);
          }, 1500);
        }

      });

    }

    function playPre(len){
      if (!isCompleteAnimate) {
        return ;
      }
      isCompleteAnimate = false;
      $imgWrap.animate({
        left: '+=' + (imgWidth * len)},
        500, function() {
        /* stuff to do after animation is complete */
        pageIndex -= len;
        if (pageIndex < 0) {
          pageIndex = ($imgs.length-1);
          $imgWrap.css({left: -(imgWidth * $imgs.length)});
        }
        dispIndex(pageIndex);
        isCompleteAnimate = true;
        if (!carouselIntervalId) {
          //自动播放
          carouselIntervalId = setInterval(function(){
            playNext(1);
          }, 1500);
        }
      });

}