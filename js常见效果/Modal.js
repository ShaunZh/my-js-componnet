/*
* @Author: Marte
* @Date:   2017-08-28 07:24:56
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 08:16:56
*/


 var DragElement = (function(){
      function _Drag(ele){
        this.$ele = $(ele);
        this.dragInfo = {
          mouseX: 0,
          mouseY: 0,
          state: false,
          ele: 0
        };
        this.bindEvent();
      }

      _Drag.prototype.bindEvent = function(){
        var _this = this;
        this.$ele.on('mousedown', function(e){
          e.preventDefault();
          if (!_this.dragInfo.state) {
            _this.dragInfo.mouseX = e.pageX;
            _this.dragInfo.mouseY = e.pageY;
            _this.dragInfo.state = true;
            _this.$ele.addClass("draggable");
          }
        });

        this.$ele.on('mouseup', function(e){
          e.preventDefault();
          if(_this.dragInfo.state) {
            _this.dragInfo.state = false;
            _this.$ele.removeClass("draggable");

          }
        });

        $(document).on('mousemove', function(e){
          e.preventDefault();
          if(_this.dragInfo.state) {

            var moveX = _this.$ele.offset().left + (e.pageX - _this.dragInfo.mouseX),
                moveY = _this.$ele.offset().top + (e.pageY - _this.dragInfo.mouseY);
            _this.$ele.offset({
              left: moveX,
              top: moveY
            });
            _this.dragInfo.mouseX = e.pageX;
            _this.dragInfo.mouseY = e.pageY;
          }
        });
      }
      return {
        init: function(ele){
          new _Drag(ele);
        }
      }
    })();


    function Dialog(){
      this.createDialog();
      this.bindEvent();
    }

    // 创造一个dialog：该dialog包含一个dialog该有的所有信息
    // 为这个dialog绑定事件：虽然根据输入的dialog的配置信息，可能会出现某个按钮实际不存在，但是也为它绑定了事件的情况，没有关系，在后面的函数中，我们会根据配置信息，将不存在的按钮不让它进行显示，因此，即使绑定了事件也没有关系

    Dialog.prototype = {
      defaultOps: {
        title: '',
        message: '',
        isShowCloseBtn: true,
        isShowComfirmBtn: false,
        onClose: function(){},
        onComfirm: function(){}
      },

      createDialog: function(){
        var tpl = '<div class="dialog" style="display:none">' + '<div class="dialog-box">' + '<div class="dialog-header"><h3></h3><span class="btn-close">x</span></div>' + '<div class="dialog-content">' + '</div>' + '<div class="dialog-footer">' + '  <a href="#" class="btn btn-close">取消</a>' + '  <a href="#" class="btn btn-confirm">确定</a>' + '</div>' + '</div>' + '</div>';
        // 创建模态遮挡层
        var fade = '<div class="fade"></div>';

        this.$dialog = $(tpl);
        this.$fade = $(fade);
        $('body > .container > .content').append(this.$dialog);
        $('body').append(this.$fade);

      },

      bindEvent: function(){
        var _this = this;
        var drag = {
          x: 0,
          y: 0,
          state: false,
          ele: 0
        };
        // 取消按钮事件
        this.$dialog.find('.btn-close').on('click', function(e){
          e.preventDefault();
          _this.ops.onClose();
          _this.deleteDialog();
          _this.deleteModal();
        });
        // 确认按钮事件
        this.$dialog.find('.btn-confirm').on('click', function(e){
          e.preventDefault();
          _this.ops.onComfirm();
          _this.deleteDialog();
          _this.deleteModal();
        });
        DragElement.init(this.$dialog);
      },

      // 通过该方法来创建一个完整的Dialog
      open: function(ops) {
        this.setOps(ops);
        this.setDialog();
        this.activeFade();
        this.showDialog();

      },

      activeFade: function(){
        this.$fade.addClass('fade-active');
      },

      setOps: function(ops){
        // 下面的this.ops在执行下面的代码时，其实是不存在的，执行下面的代码后，就像等于在当前对象上添加了ops属性
        if (typeof ops === 'string'){
          this.ops = $.extend({}, this.defaultOps, {
            message: ops
          });
        } else if (typeof ops === 'object'){
          this.ops = $.extend({}, this.defaultOps, ops);
        }
      },

      setDialog: function(){
        var $dialog = this.$dialog;

        // 根据this.ops 对没有配置的元素进行隐藏，对配置了的元素进行显示
        if (!this.ops.title) {
          $dialog.find('.dialog-header').hide();
        } else{
          $dialog.find('.dialog-header').show();
        }
        if (!this.ops.isShowCloseBtn) {
          $dialog.find('.dialog-footer .btn-close').hide();
        } else{
          $dialog.find('.dialog-footer .btn-close').show();
        }
        if (!this.ops.isShowComfirmBtn) {
          $dialog.find('.btn-confirm').hide();
        } else {
          $dialog.find('.btn-confirm').show();

        }
        $dialog.find('.dialog-header h3').text(this.ops.title);
        $dialog.find('.dialog-content').html(this.ops.message);
      },

      showDialog: function(){
        this.$dialog.show();
      },

      hideDialog: function(){
        this.$dialog.hide();
      },

      deleteDialog: function(){
        this.$dialog.remove();

      },

      deleteModal: function(){
        this.$fade.remove();
      }
    };

    $('#open1').on('click', function(e){
      var dialog = new Dialog();
      dialog.open('这是个dialog');
      // $('.fade').addClass('fade-active');
    });


    $('#open2').on('click', function(e){
      var message = '<a href="http://baidu.com">百度</a>'
      var dialog = new Dialog();
      dialog.open({
        message: message
      });
    });


    $('#open3').on('click', function(e){
      var dialog = new Dialog();
      dialog.open({
        title: '大丸子你好呀',
        message: '你也好呀',

      });
    });

    $('#open4').on('click', function(e){
      var message = '<ul><li>大丸子</li><li>逼哥</li><li>放风筝的小小马</li></ul>'
      var dialog = new Dialog();
      dialog.open({
        title: '放风筝的小小马',
        message: message,
        // isShowCloseBtn: true,
        isShowComfirmBtn: true,
        onClose: function(){
          alert('你真的要关闭呀');
        },
        onComfirm: function(){
          alert('太棒了');
        }
      });
    });

    $('#open5').on('click', function(e){

      var dialog = new Dialog();
      dialog.open({
        title: '放风筝的小小马',
        message: '不知道写啥呀',
        isShowCloseBtn: false
      });
    });