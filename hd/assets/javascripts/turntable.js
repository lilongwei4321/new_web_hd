(function(win){
  function Turntable (id,opts,fn){
    var obj = {
      oPointer   : "#img1",
      oTurntable : "#img2",
      temp       : 0 ,
      cat        : 0 ,
      time       : 4
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.oPointer   = $(obj.oPointer);
    this.oTurntable = $(obj.oTurntable);
    this.temp       = obj.temp*1;
    this.cat        = obj.cat;
    this.fn         = fn;
    this.jiang      = '111';
    this.time       = obj.time;
    this.init() ;
  }
  Turntable.prototype = {
    //初始化
    init : function(){
      this.clickBtn(this.oTurntable );//点击抽奖
    },
    //判断选中的奖
    getJiang : function(n){
      var zhi = ( Math.floor ( Math.random ( ) * n + 1 ) );
      if(zhi<4){
        // console.log('555')
        this.jiang  = '555';
        return '555';
      } else if(zhi<51){
        // console.log('222')
        this.jiang  = '222';
         return '222';
      } else if(zhi<=100){
        // console.log('111')
        this.jiang  = '111';
        return '111';
      }
    },
    //增加转动区域范围
    ZengQuyv : function(rdm,num1,num2,num3){
      var str = this.getJiang(100),
          obj = {
            '111' : num1,
            '222' : num2,
            '555' : num3
          }
      return (rdm*1)+(obj[str]*1);
    },
    //量数之间取值
    // getRand : function(m,n){
    //   return Math.floor(Math.random()*(m-n+1))+n;
    // },
    //点击抽奖
    clickBtn : function(oTurntable){
      var rdm = 0,that=this;
        // 随机计算出旋转的角度
        // rdm = Math.floor(Math.random() * (3600 - 3603 + 1) + 3603)+that.temp;
          rdm = 3600+that.temp;
          var zhi = rdm%360,
              zhong = '';
          if(zhi == 0){
            rdm = this.ZengQuyv(rdm,80,40,160);
          } else if(zhi == that.cat*1){
            rdm = this.ZengQuyv(rdm,40,0,120);
          } else if(zhi == that.cat*2){
            rdm = this.ZengQuyv(rdm,0,120,80);
          } else if(zhi == that.cat*3){
            rdm = this.ZengQuyv(rdm,160,80,40);
          } else if(zhi == that.cat*4){
            rdm = this.ZengQuyv(rdm,120,40,0);
          } else if(zhi == that.cat*5){
            rdm = this.ZengQuyv(rdm,80,0,120);
          } else if(zhi == that.cat*6){
            rdm = this.ZengQuyv(rdm,40,160,80);
          } else if(zhi == that.cat*7){
            rdm = this.ZengQuyv(rdm,0,120,40);
          } else if(zhi == that.cat*8){
            rdm = this.ZengQuyv(rdm,120,80,0);
          } else{
            alert('no',zhi,that.cat)
          }
          // 旋转
          // oTurntable.css({
          //     transition: "all 4s",
          //     transform: "rotate(" + rdm + "deg)"
          // });
          var s = '-webkit-transform: rotate('+rdm+'deg);transform: rotate('+rdm+'deg);-webkit-transition-duration: '+that.time+'s;transition-duration:'+that.time+'s;-webkit-transition-timing-function: ease;transition-timing-function: ease;';
          oTurntable.attr('style',s);
          //轮盘已旋转度数
          oTurntable.attr('data-num',rdm);
          var that = this;
          setTimeout(function(){
            that.fn (that.jiang)
          },(that.time*1000+1000));
    }
  }
  $.fn.extend({
    Turntable : (opts,fn) => {
      return new Turntable(this,opts,fn)
    }
  })
  // $.fn.extend()
})(window)