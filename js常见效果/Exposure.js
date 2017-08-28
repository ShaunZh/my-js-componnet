/*
* @Author: Marte
* @Date:   2017-08-28 01:18:18
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 01:37:24
*/

'use strict';
 var Exposure = (function(){
  function _Exposure(target, callback){
    this.$target = $(target);
    this.callback = callback;
    this.bind();
    this.check();
  }
  _Exposure.prototype.bind = function() {
    var _this = this;
     $(window).scroll(function(){
        _this.check();
      });
  }
  _Exposure.prototype.check = function() {
    if (this.isVisible(this.$target)) {
      this.callback(this.$target);
    }
  }
  _Exposure.prototype.isVisible = function($node){
    var windowHeight = $(window).height(),
        windowScroll = $(window).scrollTop(),
        nodeOffsetTop = $node.offset().top,
        nodeHeight = $node.height();
     if (windowHeight + windowScroll > nodeOffsetTop &&
      windowScroll < nodeOffsetTop + nodeHeight) {
      return true;
    } else {
      return false;
    }
  }
  return {
    init : function($node, callback){
      console.log($node);
      $.each($node, function(){
        new _Exposure(this, callback);
      });
    }
  }
})();

function loadImg($img){
  if (!($img.attr('src') === $img.attr('data-src'))) {
    $img.attr('src', $img.attr('data-src'));
  }
}

function loadWord($word){
  $word.text($word.text() + ' world');
}

Exposure.init($('.exposure-load img'), loadImg);
//Exposure.init($('.load-word'), loadWord);
