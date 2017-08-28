/*
* @Author: Marte
* @Date:   2017-08-28 02:40:07
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 07:04:57
*/

 var Tab = (function(){
    function _Tab(ct){
      this.$ct = $(ct);
      this.$btns = this.$ct.find('.btn-group > button');
      this.$contents = this.$ct.find('.view li');
      this.bind();
    }

    _Tab.prototype.bind = function(){
      var _this = this;
      $.each(this.$btns, function(){
        var $this =$(this);
        $this.on('click', function(){
          if (!$this.hasClass('active')){
            _this.$btns.removeClass('active');
            _this.$contents.removeClass('active');
            $this.addClass('active');
            _this.$contents.eq(_this.$btns.index($this)).addClass('active');
          }

        });
      });
    }

    return {
      init: function($ct){
        $.each($ct, function(){
          new _Tab($(this));
        });
      }
    }
  })();

  Tab.init($('.content'));