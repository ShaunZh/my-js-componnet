/*
* @Author: Marte
* @Date:   2017-08-28 01:47:49
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-28 01:48:05
*/

'use strict';
var Calendar = (function(){
    function _Calendar(ct, isReset){
      this.$ct = $(ct);
      this.$inputCalendar = $(ct).find('.calendar__input .date-input');
      this.$calendar = $(ct).find('.calendar__select--wrap');
      this.$preYear = $(ct).find('.icon-pre-year');
      this.$table = $(ct).find('.calendar-content');
      this.$preMonth =$(ct).find('.icon-pre-month');
      this.$nextYear = $(ct).find('.icon-next-year');
      this.$nextMonth = $(ct).find('.icon-next-month');
      this.$curYearMont = $(ct).find('.calendar-header .cur-year-month')
      this.$document = $(document);
      this.$allCalendar =  $(document).find('.calendar .calendar__select--wrap');
      this.isReset = isReset;
      this.nowMoment = moment();
      this.curSelectMoment = moment();
      this.init();
      this.bind();
    }
    _Calendar.prototype.init = function(){
      this.curSelectMoment = moment();
      this.render(this.curSelectMoment);
    }
    _Calendar.prototype.bind = function(){
      var _this = this;
      var dateArr = [];
      this.$document.on('click', function(e){
        if (_this.$calendar.css("display") !== 'none') {
          _this.$calendar.fadeOut(100);
        }
      });
      // 绑定事件
      this.$ct.on('click', function(e){
        var $target = $(e.target);
        e.stopPropagation();
        if ($target.hasClass('date-input')) {
          if (_this.$calendar.css("display") === 'none') {
            $.each(_this.$allCalendar, function(){
              $(this).css('display', 'none');
            })
            if (_this.isReset === true){
              _this.init();
            }
            _this.$calendar.fadeIn(200);
          } else {
            _this.$calendar.fadeOut(100);
          }
        } else if ($target.hasClass('icon-pre-year')) {
          _this.curSelectMoment.month(_this.curSelectMoment.month() - 12);
          _this.render(_this.curSelectMoment);
        } else if ($target.hasClass('icon-pre-month') || $target.hasClass('pass-day')) {
          _this.curSelectMoment.month(_this.curSelectMoment.month() - 1);
          _this.render(_this.curSelectMoment);
        } else if ($target.hasClass('icon-next-year')) {
          _this.curSelectMoment.month(_this.curSelectMoment.month() + 12);
          _this.render(_this.curSelectMoment);
        } else if ($target.hasClass('icon-next-month') || $target.hasClass('future-day')) {
          _this.curSelectMoment.month(_this.curSelectMoment.month() + 1);
          _this.render(_this.curSelectMoment);
        } else if ($target.hasClass('cur-month-day') || $target.hasClass('cur-day')) {
          _this.curSelectMoment.date($target.attr('data-date'));
          _this.$inputCalendar.attr('value', _this.curSelectMoment.format('YYYY/MM/DD'));
          _this.curSelectMoment = moment();
          _this.$calendar.fadeOut(100);
        }
      });
    }
    _Calendar.prototype.render = function(date){
      var dateArr = this.getDateArr(date);
      this.layout(dateArr);
    }
    _Calendar.prototype.getDateArr = function(date){
      var curSetDateObj = {
            year: date.year(),
            month: date.month(),
            day: 1,
          },
          tempRow = [],
          tempObj = {},
          dateRowsArr = [],
          _this = this;
      // 以月的第一天生成一个moment对象
      var curSelMoment = moment(curSetDateObj);
      // 假设date是2017年7月1日，那么下面这步就是将日期设置为：2017年6月25日，参考电脑上的日历
      curSelMoment.date(curSelMoment.date() - curSelMoment.weekday());
      // 将日历固定为6行显示，当日期数不足6行时，使用上一月和下一月的日期补齐
      for (var i = 0; i < 6; i++){
        for (var j = 0; j < 7; j++){
          tempObj['day'] = curSelMoment.date();
          if (curSelMoment.month() === date.month()) {
            if (_this.nowMoment.year() === curSelMoment.year() &&
                _this.nowMoment.month() === curSelMoment.month() &&
                _this.nowMoment.date() === curSelMoment.date()){
                tempObj['status'] = 'cur-day';
            } else {
              tempObj['status'] = 'cur-month-day';
            }
          } else if ((curSelMoment.month() === (curSetDateObj.month - 1)) ||
                    (curSelMoment.year() === (curSetDateObj.year - 1))){
            tempObj['status']  = 'pass-day';
          } else if (curSelMoment.month() === (curSetDateObj.month + 1) ||
                    (curSelMoment.year() === (curSetDateObj.year + 1))){
            tempObj['status'] = 'future-day';
          } else{
          }
          tempObj['date'] = curSelMoment.date();
          tempRow.push(tempObj);
          tempObj = {};
          curSelMoment.date(curSelMoment.date() + 1);
        }
        dateRowsArr.push(tempRow);
        tempRow = [];
      }
      return dateRowsArr;
    }
    _Calendar.prototype.layout = function(rows){
      var _this = this;
      var $tbody = this.$ct.find('tbody');
      if ($tbody) {
        $tbody.remove();
      }
      $tbody = $('<tbody></tbody>');
      $.each(rows, function(index, row){
        var $tr = $('<tr></tr>');
        $.each($(this), function(index, val){
          var $th = $('<td></td>');
          $th.text(val['day']);
          if (val['status'] === 'pass-day'){
            $th.addClass('pass-day');
          } else if (val['status'] === 'future-day') {
            $th.addClass('future-day')
          } else if (val['status'] === 'cur-day'){
            $th.addClass('cur-day');
          } else if (val['status'] === 'cur-month-day'){
            $th.addClass('cur-month-day');
          }
          $th.attr('data-date',val['date']);
          $tr.append($th);
        });
        $tbody.append($tr);
      });
      this.$table.append($tbody);
      // 更新日历上方显示的年月
      var monthStr = (((this.curSelectMoment.month()+1)<10) ? ('0' + (this.curSelectMoment.month() + 1)) : (this.curSelectMoment.month() + 1)) + '';
      this.$curYearMont.text(moment(this.curSelectMoment.year() + '-' + monthStr).format('YYYY年MM月'));
    }
    return {
      init: function($ct, isReset){
        $.each($ct, function(){
          new _Calendar($(this), isReset);
        })
      }
    }
  })();
  Calendar.init($('.calendar').eq(0), true);
  Calendar.init($('.calendar').eq(1), false);