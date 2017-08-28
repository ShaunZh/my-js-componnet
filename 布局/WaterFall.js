/*
* @Author: Marte
* @Date:   2017-08-28 10:18:42
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 10:25:22
*/

 //1. 获取数据
//2. 把数据变为 Dom，通过瀑布流的方式放到页面上
//3. 当滚动到底部的时候， --》 1
var pageIndex = 1,
    newsNum = 10;

var itemWidth = $('#pic-ct .item').width();
var column;
var colHeightArr = [];
var $picCt = $('#pic-ct');
var $hide = $('#pic-ct .hide');
var isDataArrive = true;
var $loadMore = $('.load');

start();


function start(){
  pinterestLayoutInit();
  getData(renderPage);
}

function insertNode(node){
  $('#pic-ct').append(node);
}

function renderPage(data){
  $.each(data, function(index, val){
    var $node = getNode(val);
    // 等待图片加载完成后，再将节点插入到DOM中，
    // 防止图片没有加载完成就插入到DOM中，导致图片无法显示
    $node.find('img').load(function(){
      insertNode($node);
      pinterestLayout($node);
    });
  });
  isDataArrive = true;
}

function getData(callback){
    $.ajax({
      url: 'http://platform.sina.com.cn/slide/album_tech',
      dataType: 'jsonp',
      jsonp:"jsoncallback",
      data: {
        app_key: '1271687855',
        num: newsNum,
        page: pageIndex
      }
    }).done(function(ret){

      if(ret && ret.status && ret.status.code === "0"){
        callback(ret.data);
        pageIndex++
      }else{
        console.log('get error data');
      }
    });
}


function getNode(item){
  var node = '';
  node = `<li class="item">
          <a href="${item.url}" class="link">
            <img src="${item.img_url}" alt="">
          </a>
          <h4 class="header">${item.short_name}</h4>
          <p class="desp">
            ${item.short_intro}
          </p>
        </li>`;
  // 将node节点返回为jq对象
  return $(node);
}


function pinterestLayoutInit(){
  column = parseInt($picCt.width() / itemWidth);
  for (var i = 0; i < column; i++) {
    colHeightArr[i] = 0;
  }
}

function pinterestLayout(node){
  var minColHeight = Math.min.apply(null, colHeightArr);
  var minColIndex  = colHeightArr.indexOf(minColHeight);
  var $node = $(node);
  $node.css({
    left: minColIndex * $node.outerWidth(true),
    top: minColHeight,
    opacity: 1
  });
  colHeightArr[minColIndex] += $node.outerHeight(true);
  $('#pic-ct').height(Math.max.apply(null, colHeightArr));
}


function isVisible(){
  var scrollTop = $(window).scrollTop(),
      winH = window.innerHeight;
      offsetTop = $loadMore.offset().top;
  if (offsetTop < scrollTop + winH){
    return true;
  } else {
    return false;
  }
}

$(window).on('scroll', function(){
  if (!isDataArrive) return;

  if (isVisible($('.load'))){
    isDataArrive = false;
    getData(renderPage);
  }
});