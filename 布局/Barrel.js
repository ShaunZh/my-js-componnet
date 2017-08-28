/*
* @Author: Marte
* @Date:   2017-08-28 13:55:04
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-29 01:22:01
*/
function Barrel(ct){
  this.$ct = ct;
  this.rowImgs = [];
  this.rowWidth = ct.width();
  this.countLoadImg = 0;
  this.perLoadImgNum = 50;
  this.loadImg();
}

Barrel.prototype = {
  loadImg: function(){
    var _this = this;
    var imgUrls = this.getImgsUrl(this.perLoadImgNum);

    $.each(imgUrls, function(index, imgUrl){
      var img = new Image();
      img.src = imgUrl;

      img.onload = function(){
        var imgInfo = {
          target: img,
          width: 100 * (img.width / img.height) ,
          height: 100
        };
        _this.render(imgInfo);
        console.log('index = ' + index + ', img = ' + img.src);
      };
    });
  },

  render: function(imgInfo){
    var imgsWidth = 0;
    this.rowImgs.push(imgInfo);

    $.each(this.rowImgs, function(index, imgInfoItem){
      imgsWidth += imgInfoItem.width;
    });

    if (imgsWidth > this.rowWidth) {
      this.rowImgs.pop();
      var newImgHeight = this.rowWidth * (imgInfo.height / (imgsWidth - imgInfo.width));
      this.countLoadImg += this.rowImgs.length;
      this.layout(newImgHeight);
      this.rowImgs = [];
      this.rowImgs.push(imgInfo);
    } else if (this.countLoadImg + this.rowImgs.length >= this.perLoadImgNum){
      // 这一部分用于渲染最后一行的图片
      this.layout(imgInfo.height);
    }
  },

  layout: function(newImgHeight){
    var $div = $('<div class="img-row"></div>');
    $.each(this.rowImgs, function(index, imgInfoItem) {
      var $img = $(imgInfoItem.target);
      $img.height(newImgHeight);
      $div.append($img);
    });
    this.$ct.append($div);
  },


  getImgsUrl: function(imgNum){
    var urls = [];
    var color, width, height;
    for (var i = 0 ; i < imgNum; i++){
      color = Math.random().toString(16).substring(2,8);
      width = Math.floor(Math.random()*100 + 50);
      height = Math.floor(Math.random()*30 + 50);
      urls.push('http://placehold.it/' + width + 'x' + height + '/' + color + '/fff');
    }
    return urls;
  }
}

var barrel = new Barrel($('.img-wrap'));

function isScrollBottom(){
  if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
    return true;
  }
  return false;
}

$(window).scroll(function(){
  if (isScrollBottom()) {
    barrel.perLoadImgNum = 20;
    barrel.loadImg();
  }
});
